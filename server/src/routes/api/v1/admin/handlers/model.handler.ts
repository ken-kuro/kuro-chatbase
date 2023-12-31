// this the dedicated file for the model handler for the admin route
// why i do this? because i want to make the code more readable and easy to maintain
import { FastifyReply, FastifyRequest } from "fastify";
import {
  FetchModelFromInputedUrlRequest,
  SaveModelFromInputedUrlRequest,
  ToogleModelRequest,
} from "./type";
import axios from "axios";

const _getModelFromUrl = async (url: string) => {
  try {
    const response = await axios.get(`${url}/models`);
    return response.data as {
      type: string;
      data: {
        id: string;
        object: string;
      }[];
    };
  } catch (error) {
    return null;
  }
};

export const getAllModelsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const prisma = request.server.prisma;
    const user = request.user;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }
    const allModels = await prisma.kurobaseModels.findMany({
      where: {
        deleted: false,
      },
    });

    return {
      data: allModels,
    };
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const fetchModelFromInputedUrlHandler = async (
  request: FastifyRequest<FetchModelFromInputedUrlRequest>,
  reply: FastifyReply
) => {
  try {
    const { url } = request.body;
    const user = request.user;
    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const model = await _getModelFromUrl(url);

    if (!model) {
      return reply.status(404).send({
        message:
          "Unable to fetch model. Inputed url is not openai api compatible",
      });
    }

    return {
      data: model.data,
    };
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const saveModelFromInputedUrlHandler = async (
  request: FastifyRequest<SaveModelFromInputedUrlRequest>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;
    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const { url, model_id, name, stream_available } = request.body;

    const modelExist = await prisma.kurobaseModels.findFirst({
      where: {
        model_id: model_id,
        hide: false,
        deleted: false,
      },
    });

    if (modelExist) {
      return reply.status(400).send({
        message: "Model already exist",
      });
    }

    await prisma.kurobaseModels.create({
      data: {
        name: name,
        model_id: model_id,
        stream_available: stream_available,
        local_model: true,
        model_provider: "local",
        config: {
          baseURL: url,
        },
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const hideModelHandler = async (
  request: FastifyRequest<ToogleModelRequest>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.body;

    const user = request.user;

    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const model = await prisma.kurobaseModels.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });

    if (!model) {
      return reply.status(404).send({
        message: "Model not found",
      });
    }

    await prisma.kurobaseModels.update({
      where: {
        id: id,
      },
      data: {
        hide: !model.hide,
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export const deleteModelHandler = async (
  request: FastifyRequest<ToogleModelRequest>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.body;

    const user = request.user;

    const prisma = request.server.prisma;

    if (!user.is_admin) {
      return reply.status(403).send({
        message: "Forbidden",
      });
    }

    const model = await prisma.kurobaseModels.findFirst({
      where: {
        id: id,
        deleted: false,
      },
    });

    if (!model) {
      return reply.status(404).send({
        message: "Model not found",
      });
    }

    if (!model.local_model) {
      return reply.status(400).send({
        message: "Only local model can be deleted",
      });
    }

    await prisma.kurobaseModels.delete({
      where: {
        id: id,
      },
    });

    return {
      message: "success",
    };
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
