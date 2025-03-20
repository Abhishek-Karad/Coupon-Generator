const Coupon = require('../model/coupoun');
const Claim = require('../model/claim');


exports.claimCoupon = (req, res) => {
    const ipAddress = req.ip;
    const sessionId = req.cookies.sessionId || Math.random().toString(36).substr(2);
  
    Claim.findOne({ $or: [{ ipAddress }, { sessionId }] })
      .then(existingClaim => {
        if (existingClaim) {
          return res.render("index", { coupon: null, message: "You have already claimed a coupon!", csrfToken: req.csrfToken() });
        }
  
        return Coupon.findOne({ isClaimed: false }).sort("_id");
      })
      .then(coupon => {
        if (!coupon) {
          return res.render("index", { coupon: null, message: "No coupons available.", csrfToken: req.csrfToken() });
        }
  
        coupon.isClaimed = true;
        return coupon.save()
          .then(() => Claim.create({ coupon: coupon._id, ipAddress, sessionId }))
          .then(() => {
            res.cookie("sessionId", sessionId, { maxAge: 24 * 60 * 60 * 1000 });
            res.render("index", { coupon: coupon.code, message: "Coupon claimed successfully!", csrfToken: req.csrfToken() });
          });
      })
      .catch(error => {
        res.render("index", { coupon: null, message: "Server error occurred.", csrfToken: req.csrfToken() });
      });
  };
  