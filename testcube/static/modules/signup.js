define(['jquery'], function ($) {
    return function () {

        function updateUserNameAndEmail() {
            $(function () {
                    usernameInput = $('input[name="username"]');
                    emailInput = $('input[name="email"]');
                    domain = emailInput.attr('data-text');
                    domain = domain ? domain : 'company.com';
                    username = usernameInput.val();

                    email = username + '@' + domain;
                    emailInput.val(email.toLowerCase());
                }
            );
        }

        // when page ready
        $(function () {
            $('input[name="username"]').keyup(updateUserNameAndEmail);
        });
    }
});
