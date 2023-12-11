const Community = require("../models/community")
const { routeTryCatcher } = require("../utils/controllers")
const QueryBuilder = require("../utils/QueryBuilder")
const {
  findMembership,
  deleteMembership,
  getAllUserMemberships,
  createMembership,
} = require("./membership")

module.exports.getSingleCommunityById = async function (id) {
  return await Community.findById(id)
}

module.exports.createCommunity = async function (data) {
  const { name, description, userId } = data
  const community = new Community({
    name,
    description,
    moderators: [userId],
  })
  return await community.save()
}

module.exports.updateCommunity = async function (data) {
  const {
    communityId,
    name,
    description,
    primaryCoverImage,
    secondaryCoverImage,
    moderators,
    userId,
  } = data
  return await Community.findOneAndUpdate(
    { _id: communityId, moderators: { $in: userId } },
    {
      name,
      description,
      primaryCoverImage,
      secondaryCoverImage,
      moderators,
    },
    { new: true }
  )
}
module.exports.joinCommunity = async function (data) {
  const { community, member } = data
  const existingMembership = await findMembership({ community, member })
  if (existingMembership !== null) return existingMembership
  return await createMembership(data)
}

module.exports.leaveCommunity = async function (data) {
  return await deleteMembership({
    member: data.member,
    community: data.community,
  })
}

module.exports.getAllUsersCommunities = async function (data) {
  return await getAllUserMemberships({ member: data.member })
}

module.exports.getMultipleCommunities = async function (data) {
  const query = {
    ...(data.search?.length > 0 ? { $text: { $search: data.search } } : {}),
    sort: data.sort || "-createdAt",
    page: data.page || 1,
    limit: data.limit || 100,
    fields: data.fields
  }
  const CommunityQueryBuilder = new QueryBuilder(Community, query)
  return await CommunityQueryBuilder.find()
}

module.exports.routeControllers = {
  post: routeTryCatcher(async function (req, res, next) {
    const { name, description } = req.body
    req.response = {
      community: await module.exports.createCommunity({
        name,
        description,
        userId: req.user._id,
      }),
      status: 200,
      message: "Created community successfully!",
    }
    return next()
  }),
  put: routeTryCatcher(async function (req, res, next) {
    const communityId = req.params.communityId
    const {
      name,
      description,
      primaryCoverImage,
      secondaryCoverImage,
      moderators,
    } = req.body
    req.response = {
      community: await module.exports.updateCommunity({
        userId: req.user._id,
        communityId,
        name,
        description,
        primaryCoverImage,
        secondaryCoverImage,
        moderators,
      }),
      status: 200,
      message: "Updated community successfully!",
    }
    return next()
  }),
  getOneById: routeTryCatcher(async function (req, res, next) {
    req.response = {
      community: await module.exports.getSingleCommunityById(
        req.params.communityId
      ),
      status: 200,
      message: "Success",
    }
    return next()
  }),
  getByUser: routeTryCatcher(async function (req, res, next) {
    req.response = {
      communities: await module.exports.getAllUsersCommunities({
        member: req.user._id, 
      }),
      status: 200,
      message: "Success",
    }
    return next()
  }),
  getAll: routeTryCatcher(async function (req, res, next) {
    req.response = {
      community: await module.exports.getMultipleCommunities({
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
        fields: req.query.fields,
      }),
      status: 200,
      message: "Success",
    }
    return next()
  }),
  join: routeTryCatcher(async function (req, res, next) {
    req.response = {
      membership: await module.exports.joinCommunity({
        community: req.params.communityId,
        member: req.user._id,
      }),
      status: 200,
      message: "Joined Successfully!",
    }
    return next()
  }),
  leave: routeTryCatcher(async function (req, res, next) {
    req.response = {
      membership: await module.exports.leaveCommunity({
        community: req.params.communityId,
        member: req.user._id,
      }),
      status: 200,
      message: "You are no longer a member!",
    }
    return next()
  }),
}
