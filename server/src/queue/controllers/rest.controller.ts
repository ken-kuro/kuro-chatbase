import { QSource } from "../type";
import { KurobaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { KurobaseRestApi } from "../../loader/rest";

export const restQueueController = async (
  source: QSource,
) => {
  let options = JSON.parse(JSON.stringify(source.options));

  const loader = new KurobaseRestApi({
    method: options.method,
    url: source.content!,
    body: options.body,
    headers: options.headers,
  });
  const docs = await loader.load();

  await KurobaseVectorStore.fromDocuments(
    docs,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};
