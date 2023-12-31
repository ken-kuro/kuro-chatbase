// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { KurobaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { KurobasePDFLoader } from "../../loader/pdf";

export const pdfQueueController = async (
  source: QSource,
) => {
  console.log("loading pdf");

  const location = source.location!;
  const loader = new KurobasePDFLoader(location);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);

  await KurobaseVectorStore.fromDocuments(
    chunks,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );

};
