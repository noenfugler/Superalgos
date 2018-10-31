import axios from 'axios'

import { logger, DatabaseError } from '../logger'

export const getMember = async (req, res, next, db) => {
  if (!req.headers.userId) return next()
  logger.info('getMember ')
  logger.info(req.headers.userId)
  try {
    const member = await getUser(req.headers.userId)
    req.user = await member
    next()
  } catch (err) {
    next()
  }

}

export const getUser = authId => {
  logger.info('getUser MiddleWare')
  logger.info(authId)
  const API_URL = 'https://app-api.advancedalgos.net/graphql'
  return new Promise((resolve, reject) => {
    try {
      return axios.post(API_URL, {
        query: `query users_User($userId: ID!) {
          users_User(id: $userId){
            id
            alias
            email
          }
        }`,
        variables: {
          userId: authId
        }
      }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          logger.info('getUser result')
          logger.info(res.data)
          resolve(res.data)
        })
        .catch(err => {
          logger.info('getUser err')
          logger.info(err)
          reject(new DatabaseError(err))
        })
    } catch (error) {
      reject(new DatabaseError(error))
    }
  })
}

export default getUser
