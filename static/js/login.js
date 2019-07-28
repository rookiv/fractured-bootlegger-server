$(document).ready(() => {
    let loginValidator = new LoginValidator();
    let emailValidator = new EmailValidator();

    $('#login').ajaxForm({
        beforeSubmit: (formData) => {
            if (!loginValidator.validateForm()) {
                return false;
            } else {
                formData.push({
                    name: 'remember-me',
                    value: $('#btn_remember').find('span').hasClass('fa-check-square')
                });
                return true;
            }
        },
        success: (responseText, status) => {
            if (status === 'success') {
                window.location.href = '/home';
            }
        },
        error: error => {
            loginValidator.showLoginError('Login Failure', 'Please check your username and/or password');
        }
    });

    $('input:text:visible:first').focus();
    $('#btn_remember').click((event) => {
        let span = $(event.currentTarget).find('span');
        if (span.hasClass('fa-minus-square')) {
            span.removeClass('fa-minus-square');
            span.addClass('fa-check-square');
        } else {
            span.addClass('fa-minus-square');
            span.removeClass('fa-check-square');
        }
    });


    $('#get-credentials-form').ajaxForm({
        url: '/lost-password',
        beforeSubmit: (formData, jqForm, options) => {
            if (emailValidator.validateEmail($('#lost-email-tf').val())) {
                emailValidator.hideEmailAlert();
                return true;
            } else {
                emailValidator.showEmailAlert("Please enter a valid email address");
                return false;
            }
        },
        success: (responseText, status, xhr, $form) => {
            $('#cancel').html('OK');
            $('#retrieve-password-submit').hide();
            emailValidator.showEmailSuccess("A link to reset your password was emailed to you.");
        },
        error: error => {
            if (error.responseText === 'email-not-found') {
                emailValidator.showEmailAlert("Email not found. Are you sure you entered it correctly?");
            } else {
                $('#cancel').html('OK');
                $('#retrieve-password-submit').hide();
                emailValidator.showEmailAlert("Sorry. There was a problem, please try again later.");
            }
        }
    });

    $('#retrieve-password-submit').click(() => {
        $('#get-credentials-form').submit();
    });
    $('#login #forgot-password').click(() => {
        $('#cancel').html('Cancel');
        $('#retrieve-password-submit').show();
        $('#get-credentials').modal('show');
    });

    let getCredentials = $('#get-credentials');
    getCredentials.on('shown.bs.modal', () => {
        $('#email-tf').focus();
    });
    getCredentials.on('hidden.bs.modal', () => {
        $('#email-tf').focus();
    });
});