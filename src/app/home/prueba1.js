
function checkLastPasswordReset(user, context, callback) {
    console.log('user', user);
    console.log('+++++++++++++++end user++++++++++++++++++++++++++++++++++++++++');
    console.log('context', context);
    console.log('+++++++++++++++end context++++++++++++++++++++++++++++++++++++++++');
  
    function daydiff(first, second) {
      return (second - first) / (1000 * 60 * 60 * 24);
    }
  
    function sendResetPassword() {
      var axios = require("axios").default;
  
      var options = {
        method: 'POST',
        url: 'https://dev-kt2aisrs.us.auth0.com/dbconnections/change_password',
        headers: { 'content-type': 'application/json' },
        data: {
          client_id: context.clientID,
          email: user.email,
          connection: user.identities[0].connection
        }
      };
  console.log('options request',options);
      axios.request(options).then(function (response) {
        console.log(response.data);
        return;
      }).catch(function (error) {
              console.error(error);
        return;
      });
    }
    const last_password_change = user.last_password_reset || user.created_at;
    console.log('diferencia', daydiff(new Date(last_password_change), new Date()));
    if (daydiff(new Date(last_password_change), new Date()) < 10) {
      console.log('redireccionando');
      context.redirect = {
        url: 'http://localhost:3000/callback'
      };
      console.log('context', context);
      console.log('+++++++++++++++end context 2++++++++++++++++++++++++++++++++++++++++');
      //return callback(new UnauthorizedError('please change your password'));
      // await sendResetPassword();
      sendResetPassword();
      return callback(null, user, context);
    }
    callback(null, user, context);
  }