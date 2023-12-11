const Membership = require("../models/membership")

module.exports.findMembership = async function (data) {
  const { member, community } = data
  return await Membership.findOne({
    member,
    community,
  })
}

module.exports.getAllMemberships = async function (data) {
  return await Membership.find({
    member: data.member,
  }) || []
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
