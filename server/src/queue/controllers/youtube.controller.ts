import { QSource } from "../type";
// import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { KurobaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { KurobaseYoutube } from "../../loader/youtube";

export const youtubeQueueController = async (
  source: QSource,
) => {
  const loader = new KurobaseYoutube({
    url: source.content!,
  });
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
