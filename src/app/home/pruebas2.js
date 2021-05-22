function checkPasswordEvent(user, context, callback) {
    const startEvent = new Date('2021-05-09T03:00:00.986Z');
    const endEvent = new Date('2021-05-20T13:32:00.986Z');
    console.log('user [event]', user);
    console.log('+++++++++++++++end user++++++++++++++++++++++++++++++++++++++++');
    console.log('context [event]', context);
    console.log('+++++++++++++++end context++++++++++++++++++++++++++++++++++++++++');

    function ofucarEmail() {
        var emailOfuscado = user.email;
        var indexArroba = emailOfuscado.indexOf('@');
        var toReplace = emailOfuscado.substring(2, indexArroba);
        emailOfuscado = emailOfuscado.replace(toReplace, '*'.repeat(toReplace.length));
        return emailOfuscado;
    }

    function changedPasswordBeforeEvent(last_password_change) {
        const lastChange = new Date(last_password_change);
        console.log('cambio antes', lastChange < endEvent);
        return lastChange < endEvent;
    }

    function loginBetween(loginBetween) {

        const middleDate = new Date(loginBetween);

        return (startEvent < middleDate && middleDate < endEvent);
    }

    function sendResetPassword() {
        var axios = require("axios").default;

        var options = {
            method: 'POST',
            url: 'https://naranja-users.auth0.com/dbconnections/change_password',
            headers: { 'content-type': 'application/json' },
            data: {
                client_id: context.clientID,
                email: user.email,
                connection: user.identities[0].connection
            }
        };
        console.log('options request', options);
        axios.request(options).then(function (response) {
            console.log(response.data);
            callback(null, user, context);
        }).catch(function (error) {
            console.error(error);
        });
    }
    // init rule
    // utilma fecha en la que logeo o creo la cuenta
    const last_profile_update = user.last_login || user.created_at;
    // sino ha cambiado la clave nunca se setea la fecha en la que creo la cuenta
    const last_password_change = user.last_password_reset || user.created_at;
    // si el usuario tuvo actividad entre el inicio del Event y la fecha de control y si
    // no ha cambiado el password despues de que se le ha enviado el email
    console.log('[event] ultimo login',last_profile_update);
    console.log('[event] ultimo cambio de clave',last_password_change);
    if (changedPasswordBeforeEvent(last_password_change) && loginBetween(last_profile_update)) {

        console.log('redireccionando');
        context.redirect = {
            url: 'https://identities.cloudnaranja.com/info/contingency-reset-password?preventchangepassword=true' + '&emailMask=' + ofucarEmail()
        };
        console.log('context', context);
        console.log('+++++++++++++++end context 2++++++++++++++++++++++++++++++++++++++++');
        //envio de email para cambio de password
        sendResetPassword();

    } else {
        console.log('[event] logeo normal');
        callback(null, user, context);
    }
}