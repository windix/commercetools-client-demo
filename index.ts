import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createLoggerMiddleware } from '@commercetools/sdk-middleware-logger'
import { config } from 'dotenv'
import fetch from 'node-fetch'

config()

const {
  COMMERCETOOLS_API_URL,
  COMMERCETOOLS_AUTH_URL,
  COMMERCETOOLS_PROJECT_KEY: projectKey,
  COMMERCETOOLS_CLIENT_ID: clientId,
  COMMERCETOOLS_CLIENT_SECRET: clientSecret,
} = process.env

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: COMMERCETOOLS_AUTH_URL,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  fetch,
})

const httpMiddleware = createHttpMiddleware({
  host: COMMERCETOOLS_API_URL,
  fetch,
})

const ctpClient = createClient({
  middlewares: [authMiddleware, createLoggerMiddleware(), httpMiddleware, createLoggerMiddleware()],
})

const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient)

apiRoot
  .withProjectKey({
    projectKey: projectKey as string,
  })
  .products()
  .withKey({ key: 'P_20010591' })
  .get()
  .execute()
  .then((response) => {
    console.log(response.body)
  })
