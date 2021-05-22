function checkLastPasswordReset(user, context, callback) {
  console.log('user', user);
  console.log('+++++++++++++++end user++++++++++++++++++++++++++++++++++++++++');
  console.log('context', context);
  console.log('+++++++++++++++end context++++++++++++++++++++++++++++++++++++++++');

  user.app_metadata = user.app_metadata || {};


  function loginBetween(loginBetween) {
    var startDay = new Date('2021-05-11T03:00:00.986Z');
    var endDay = new Date('2021-05-19T03:00:00.986Z');
    var middleDate = new Date(loginBetween);

    return (startDay < middleDate && middleDate < endDay);
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
    console.log('options request', options);
    axios.request(options).then(function (response) {
      console.log('response', response.data);
      callback(null, user, context);
    }).catch(function (error) {
      console.error(error);
    });
  }

  const last_profile_update = user.updated_at;
  // update the app_metadata that will be part of the response
  user.app_metadata.change_password_contingency = user.app_metadata.change_password_contingency || false;
  // si el usuario tuvo actividad entre las fechas dipuestas
  if (loginBetween(last_profile_update) && !user.app_metadata.change_password_contingency) {

    // persist the app_metadata update
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function () {
        console.log('redireccionando');
        context.redirect = {
          url: 'http://localhost:3000/callback'
        };
        console.log('context', context);
        console.log('+++++++++++++++end context 2++++++++++++++++++++++++++++++++++++++++');
        //envio de email para cambio de password
        sendResetPassword();
      })
      .catch(function (err) {
        callback(err);
      });

  }
}
