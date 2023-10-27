// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { KurobaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { KurobaseAudioVideoLoader } from "../../loader/audio-video";
import { convertMp3ToWave } from "../../utils/ffmpeg";

export const audioQueueController = async (
  source: QSource,
) => {
  console.log("loading audio");

  const location = source.location!;

  const videoWav = await convertMp3ToWave(location);

  const loader = new KurobaseAudioVideoLoader(videoWav);
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
