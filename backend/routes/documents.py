
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

try:
    from backend.database import get_db_connection
    from backend.services.document_service import extract_text
    from backend.rag.chunking import split_text
    from backend.rag.vector_store import store_chunks
except ImportError:
    from database import get_db_connection
    from services.document_service import extract_text
    from rag.chunking import split_text
    from rag.vector_store import store_chunks

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    allowed_extensions = {".pdf", ".docx", ".txt"}
    filename = Path(file.filename or "").name
    extension = Path(filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are allowed."
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        file_path = UPLOAD_DIR / filename
        file_path.write_bytes(content)

        text = extract_text(str(file_path))

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from the document."
            )

        chunks = split_text(text)
        total_chunks = store_chunks(chunks, filename)

        # Save document metadata in MySQL
        connection = get_db_connection()

        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO documents (filename, file_type, status)
                VALUES (%s, %s, %s)
                """,
                (filename, extension.lstrip("."), "Indexed")
            )
            connection.commit()
            cursor.close()
        finally:
            connection.close()

        return {
            "message": "Document processed successfully",
            "filename": filename,
            "chunks_created": total_chunks,
            "stored_in_chromadb": True,
            "stored_in_mysql": True
        }

    except HTTPException:
        raise
    except Exception as error:
        print("Document processing error:", str(error))
        raise HTTPException(
            status_code=500,
            detail="Document processing failed. Check backend logs."
        ) from error
    finally:
        await file.close()


@router.get("/documents")
def list_documents():
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, filename, file_type, upload_date, status
            FROM documents
            ORDER BY id DESC
            """
        )

        documents = cursor.fetchall()
        cursor.close()

        return {
            "total_documents": len(documents),
            "documents": documents
        }

    except Exception as error:
        print("Document listing error:", str(error))
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve document list."
        ) from error

    finally:
        if connection is not None and connection.is_connected():
            connection.close()
