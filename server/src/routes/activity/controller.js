const mongoose = require('mongoose');
const Activity = require('../../db/models/activity');

const {
  cookieKeyName: cookieKeyName
} = process.env;


const PER_PAGE = 6;

module.exports.getUserActivity = async (req, res) => {

  Activity
    .find({ userId: req.params.userId })
    .populate('userId')
    .populate('payload.post.postId')
    .populate('payload.post.commentId')
    .sort({
      _id: -1
    })
    .limit(PER_PAGE)
    .exec((error, activities) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: 'Could not retrieve activity'
        });
      }
      activities = activities.filter(activity =>
        activity.payload.post.postId !== null && activity.payload.post.postId.deleted === false
      );
      res.json(activities);
    });
};

/*
    READ ADDITIONAL (OLD/NEW) ACTIVITY OF A USER
*/
module.exports.getUserOldActivity = async (req, res) => {
  const { listType } = req.params;
  const { id } = req.params;

  // CHECK LIST TYPE VALIDITY
  if (listType !== 'old') {
    return res.status(400).json({
      error: 'INVALID LISTTYPE',
      code: 1
    });
  }

  // CHECK MEMO ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 2
    });
  }

  const objId = new mongoose.Types.ObjectId(req.params.id);
  // GET OLDER MEMO
  Activity.find({ writer: req.params.username, _id: { $lt: objId }})
    .populate('userId')
    .populate('payload.post.postId')
    .populate('payload.post.commentId')
    .sort({ _id: -1 })
    .limit(PER_PAGE)
    .exec((err, activities) => {
      if (err) throw err;
      activities = activities.filter(activity =>
        activity.payload.post.postId !== null && activity.payload.post.postId.deleted === false
      );
      return res.json(activities);
    });
};
