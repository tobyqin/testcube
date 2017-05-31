function updateUserNameAndEmail() {
    setTimeout(function () {
        firstName = $('input[name="first_name"]').val();
        lastName = $('input[name="last_name"]').val();
        usernameInput = $('input[name="username"]');
        emailInput = $('input[name="email"]');
        domain = emailInput.attr('data-text');
        domain = domain ? domain : 'company.com';
        username = !lastName ? firstName : firstName + '.' + lastName;

        email = username + '@' + domain;
        usernameInput.val(username.toLowerCase());
        emailInput.val(email.toLowerCase());
    }, 50);
}

// when page ready
jQuery(function () {
    $('input[name="first_name"]').keyup(updateUserNameAndEmail);
    $('input[name="last_name"]').keyup(updateUserNameAndEmail);
});
