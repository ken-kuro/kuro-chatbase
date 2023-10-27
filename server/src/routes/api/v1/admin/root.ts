import { FastifyPluginAsync } from "fastify";
import {
  kurobaseSettingsHandler,
  updateKurobaseSettingsHandler,
  getAllUsersHandler,
  registerUserByAdminHandler,
  resetUserPasswordByAdminHandler,
  fetchModelFromInputedUrlHandler,
  getAllModelsHandler,
  saveModelFromInputedUrlHandler,
  deleteModelHandler,
  hideModelHandler
} from "./handlers";
import {
  kurobaseSettingsSchema,
  updateKurobaseSettingsSchema,
  getAllUsersSchema,
  registerUserByAdminSchema,
  resetUserPasswordByAdminSchema,
} from "./schema";

import {
  fetchModelFromInputedUrlSchema,
  getAllModelsSchema,
  saveModelFromInputedUrlSchema,
  toogleModelSchema
} from "./schema/model";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/kurobase-settings",
    {
      schema: kurobaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    kurobaseSettingsHandler
  );

  fastify.post(
    "/kurobase-settings",
    {
      schema: updateKurobaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    updateKurobaseSettingsHandler
  );

  fastify.get(
    "/users",
    {
      schema: getAllUsersSchema,
      onRequest: [fastify.authenticate],
    },
    getAllUsersHandler
  );

  fastify.post(
    "/register-user",
    {
      schema: registerUserByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    registerUserByAdminHandler
  );

  fastify.post(
    "/reset-user-password",
    {
      schema: resetUserPasswordByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    resetUserPasswordByAdminHandler
  );

  fastify.get(
    "/models",
    {
      schema: getAllModelsSchema,
      onRequest: [fastify.authenticate],
    },
    getAllModelsHandler
  );

  fastify.post(
    "/models",
    {
      schema: saveModelFromInputedUrlSchema,
      onRequest: [fastify.authenticate],
    },
    saveModelFromInputedUrlHandler
  );

  fastify.post(
    "/models/fetch",
    {
      schema: fetchModelFromInputedUrlSchema,
      onRequest: [fastify.authenticate],
    },
    fetchModelFromInputedUrlHandler
  );


  fastify.post(
    "/models/delete",
    {
      schema: toogleModelSchema,
      onRequest: [fastify.authenticate],
    },
    deleteModelHandler
  );


  fastify.post(
    "/models/hide",
    {
      schema: toogleModelSchema,
      onRequest: [fastify.authenticate],
    },
    hideModelHandler
  );
};

export default root;
