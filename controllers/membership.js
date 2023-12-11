const Membership = require("../models/membership")

module.exports.findMembership = async function (data) {
  const { member, community } = data
  return await Membership.findOne({
    member,
    community,
  })
}

module.exports.getAllUserMemberships = async function (userId) {
  return await Membership.find({
    member: userId,
  }) || []
}

module.exports.getAllCommunityMembers = async function (communityId) {
  return (await Membership.find({
    community: communityId,
  }) || []).map(membership => membership.member)
}

module.exports.createMembership = async function (data = {}) {
  const { member, community } = data
  console.log(member, community)
  const newMembership = new Membership({
    member,
    community,
  })
  return await newMembership.save()
}
module.exports.deleteMembership = async function (data = {}) {
  const { member, community } = data
  return await Membership.findOneAndDelete({
    member,
    community,
  })
}
