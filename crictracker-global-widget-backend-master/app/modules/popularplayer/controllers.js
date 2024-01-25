const controllers = {}
const grpcControllers = require('../../grpc/client')

controllers.getPopularPlayers = async (parent, { input }, context) => {
  try {
    const { nLimit = 10 } = input
    const grpcData = await grpcControllers.getPopularPlayer({ nLimit })
    return grpcData?.aPlayer
  } catch (error) {
    return error
  }
}

module.exports = controllers
