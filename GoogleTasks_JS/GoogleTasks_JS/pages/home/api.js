var API = WinJS.Class.define(
    function () {
        this.APIKey = "AIzaSyA-VbHhb1CS55CmoiEeooMaxRuDH4wiOiM";
        this.ClientSecret = "NyMPiwEJfxCMgInQKJhBfQQp";
        this.ClientId = "467291388583.apps.googleusercontent.com";
        this.RedirectURI = "urn:ietf:wg:oauth:2.0:oob";
        this.Scope = "https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly";
        this.AuthUrlBase = "https://accounts.google.com/o/oauth2/auth";
        this.ApprovalUrl = "https://accounts.google.com/o/oauth2/approval";
        this.TokenUrl = "https://accounts.google.com/o/oauth2/token";
    },
    {
        APIKey: "",
        ClientSecret: "",
        ClientId: "",
        RedirectURI: "",
        AuthUrlBase: "",
        AuthUrl: function () {
            var url = this.AuthUrlBase;
            url += "?scope=" + this.Scope;
            url += "&redirect_uri=" + this.RedirectURI;
            url += "&response_type=code";
            url += "&client_id=" + this.ClientId;
            return url;
        },
        ApprovalUrl: "",
        TokenUrl: "",
        Scope: "",
        AuthenticationToken: "",
        AccessToken: "",
        RefreshToken: "",
        Authorize: function () {
            var startURI = new Windows.Foundation.Uri(this.AuthUrl());
            var endURI = new Windows.Foundation.Uri(this.ApprovalUrl);
            var api = this;

            authzInProgress = true;
            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                Windows.Security.Authentication.Web.WebAuthenticationOptions.useTitle, startURI, endURI)
                .done(function (result) {
                    if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                        //document.getElementById("GoogleDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                    }

                    var respData = result.responseData.split('=');
                    if (respData.length > 1) {

                        authToken = respData[1];
                        authorized = true;
                        authzInProgress = false;

                        var tokenInfoUrl = api.TokenUrl;
                        var postData = "code=" + authToken + "&client_id=" + api.ClientId + "&client_secret=" + api.ClientSecret + "&redirect_uri=" + api.RedirectURI + "&grant_type=authorization_code";

                        var params = {
                            url: tokenInfoUrl,
                            type: "post",
                            headers: { "Content-type": "application/x-www-form-urlencoded" },
                            data: postData
                        };

                        WinJS.xhr(params).done(
                                function completed(request) {
                                    var json = JSON.parse(request.responseText);
                                    api.AccessToken = json.access_token;
                                    api.GetLists();
                                },
                                function error(request) {
                                    var r = request;
                                },
                                function progress(request) {

                                    var r = request;

                                }
                        );
                    }
                }, function (err) {
                    WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
                    //document.getElementById("GoogleDebugArea").value += " Error Message: " + err.message + "\r\n";
                    authzInProgress = false;
                });


        },
        GetLists: function () {
            var apiURL = 'https://www.googleapis.com/tasks/v1/users/@me/lists?maxResults=100&key=' + this.APIKey;
            var authHeader = 'Bearer ' + this.AccessToken
            WinJS.xhr({ url: apiURL, headers: { Authorization: authHeader } }).done(
                    function completed(request) {
                        var json = JSON.parse(request.responseText);
                    },
                    function error(request) {
                        var r = request;
                    },
                    function progress(request) {
                        var r = request;
                    }
            );
        }
    }
);