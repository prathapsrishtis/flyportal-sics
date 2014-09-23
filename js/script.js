angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('fly-menu', {
            url: "/fly-menu",
            abstract: true,
            templateUrl: "fly-side-menu.html",
            controller: "MainCtrl"
        })
        .state('fly-menu.home', {
            url: "/home",
            views: {
                'menuContent' :{
                    templateUrl: "home.html",
                    controller: "MainCtrl"
                }
            }
        })
        .state('fly-menu.register', {
            url: "/register",
            views: {
                'menuContent' :{
                    templateUrl: "register.html",
                    controller: "RegisterCtrl"
                }
            }
        })
        .state('fly-menu.index', {
            url: "/index",
            views: {
                'menuContent' :{
                    templateUrl: "index.html",
                    controller: "IndexCtrl"
                }
            }
        })
    $urlRouterProvider.otherwise("/fly-menu/home");
})


.factory('ajaxService', function($http) {
    return {
        ajaxCall: function(url, datas) {
            //alert(JSON.stringify(datas));
            return $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: datas
            }).success(function(data) {

                return data;
            });

        }
    }
})


.run(function($ionicPopup, $rootScope, $http, $ionicLoading, $state, $ionicPlatform, ajaxService) {
    // $rootScope.siteUrl  =   'http://localhost/HTML5/Projects/FlyPortal/api/';
    $rootScope.loadingShow = function() {
        $ionicLoading.show({
            template: '<i class="ion-loading-c"></i> Loading...',
            noBackdrop :true
        });
    };

    $rootScope.loadingHide = function(){
        $ionicLoading.hide();
    };

    $rootScope.logOut   =   function(){
        localStorage.setItem('user_id',"");
        $rootScope.logoutBtnStatus = false;
        $state.go('fly-menu.home');
    }

    $rootScope.siteUrl  =   'http://sicsglobal.com/projects/HybridApp/FlyPortal/api/';
    // $rootScope.siteUrl  =   'http://localhost/vishnu/projects/FlyPortal/api/';
    $rootScope.loadingShow();
    ajaxService.ajaxCall($rootScope.siteUrl+'common.php', {
        status: 'users'
    }).then(function(response) {
       // alert(JSON.stringify(response.data.users));
        $rootScope.loadingHide();
        $rootScope.users  = response.data.users;
        $rootScope.feeds  = response.data.feeds;
        //$rootScope.today  = response.data.today;

    });

    $rootScope.loginDummy   =   function(){
        $rootScope.logoutBtnStatus = true;
        localStorage.setItem('user_id',1);
        $state.go('fly-menu.index');
    }

    if(localStorage.getItem('user_id')==""){
        $rootScope.userId="";
        $rootScope.logoutBtnStatus  =   false;
        $rootScope.status = false;
    }else{
        $rootScope.userId=localStorage.getItem('user_id');
        $rootScope.logoutBtnStatus  =   true;
        $rootScope.status = true;
        $state.go('fly-menu.index');
    }

    var showFullScreen = true,
        showStatusBar  = true;

    ionic.Platform.ready(function(){
        ionic.Platform.fullScreen(showFullScreen, showStatusBar);
        StatusBar.overlaysWebView(true);
        //StatusBar.backgroundColorByName('green');
        StatusBar.backgroundColorByHexString("#43CEE6"); //Calm color
    });

    $rootScope.showDatepicker =   function(){
        var options = {
            date: new Date(),
            mode: 'date'
        };
        datePicker.show(options, function(date){
          datefortext   = date.getFullYear()+"-"+date.getMonth()+"-"+ date.getDate();
            document.getElementById('enddate').value    = datefortext;
        });
    }

})



.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $state, $rootScope, $ionicPopup, ajaxService, $ionicLoading) {
    
    $scope.user = {
        email: "",
        password: "",
        status:"login"
    };
    //$rootScope.feeds=   [{username:'Jacob',time:'Today 9:00 am',feed:'There are many variations of passages of Lorem Ipsum available, but the majority ',image:'3.jpg'},
    //    {username:'John Cena',time:'Today 8:30 am',feed:' Full he none no side. My to considered delightful invitation announcing of no decisively boisterous. Did add dashwoods deficient man concluded additions resources.',image:'userimg.png'},
    //    {username:'Jacob',time:'Today 9:30 am',feed:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',image:'3.jpg'},
    //
    //    ];

    $rootScope.status  = false;

    if(localStorage.getItem('user_id')!=""){

        $rootScope.status  = true;

        $state.go('fly-menu.index');
    }




    $scope.userLogin    =   function(user){
        $scope.userFindStatus;
        if(user.email==""){
            $ionicPopup.alert({
                title: 'Enter email address'
            });
        } if(user.password==""){
            $ionicPopup.alert({
                title: 'Enter password'
            });
        } else {
            $rootScope.loadingShow();
            ajaxService.ajaxCall($rootScope.siteUrl+'common.php', $scope.user).then(function(response) {
                $rootScope.loadingHide();
                if(response.data.status=='success'){
                    $rootScope.userId   =   response.data.user_id;
                    $rootScope.logoutBtnStatus  =   true;

                    $rootScope.status  = true;

                    localStorage.setItem('user_id',$rootScope.userId)
                    $ionicPopup.alert({
                        title: 'Login success'
                    });
                    $state.go('fly-menu.index');
                } else{
                    $ionicPopup.alert({
                        title: 'Login details are incorrect'
                    });
                }
           });
       }
    }
    
    
    $scope.errorStatus  = false;
    $scope.loginStatus  = true;
    $scope.regStatus    = true;
    $scope.checkUser    = function(email){
        $rootScope.userEmail    =   email;
        var keepGoing = true;
        angular.forEach($rootScope.users, function(value, key) {
            if(keepGoing) {
                if (value.email == email) {
                    //console.log('ok');
                    $scope.errorStatus = true;
                    $scope.loginStatus = false;
                    $scope.regStatus = true;
                    // return false;
                    keepGoing = false;
                } else {
                    //console.log('error');
                    $scope.errorStatus = false;
                    $scope.loginStatus = true;
                    $scope.regStatus = false;
                    // return true;
                }
            }
        });
    }

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

})



.controller('RegisterCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, ajaxService, $rootScope, $state, $ionicLoading, $filter, dateFilter) {

    if(localStorage.getItem('user_id')!=""){
        $state.go('fly-menu.index');
    }

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    //$scope.arrayCheck   =   function(){
    //  $scope.s =  $filter('filter')($rootScope.users,{email:'mujeeb@m.com'});
    //    console.log($scope.s[0].email);
    //}

    $scope.date = new Date();

    $scope.$watch('date', function (date){
        $scope.today = dateFilter(date, 'yyyy-MM-dd');
        //alert($scope.today);
    });

    $scope.jobDetails = {
        id:"",
        designation:"",
        company:"",
        startdate:"",
        enddate:"",
        roles:"",
        roles2:""
    }

    $scope.repeatData   = [];

    $scope.repeatDiv    =   function(){
        $scope.test =   {
            "id":2
        }

        $scope.repeatData.push($scope.test);

    }

    $scope.userJobs     = [];
    $scope.userJobCount = 0;
    $scope.pushUser =   function(){
        $scope.jobDetails.id  = $scope.userJobCount++;
        $scope.userJobs.push($scope.jobDetails);
        $scope.jobDetails = {
            id:"",
            designation:"",
            company:"",
            startdate:"",
            enddate:"",
            roles:"",
            roles2:""
        }
        console.log($scope.userJobs);
    }

    $scope.showContent  =  function(id){
        //alert(id);
        $scope.result =  $filter('filter')($scope.userJobs,{id:id});
        console.log($scope.result);
    }

    $scope.register = {
        email   :$rootScope.userEmail ,
        password:"",
        repassword:"",
        name:"",
        username:"",
        status:'register'
    };

    $scope.userRegister = function(register){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(register.email=="" || re.test(register.email)==false){
            $ionicPopup.alert({
                title: 'Enter email address'
            });
        }
        else if(register.password==""){
            $ionicPopup.alert({
                title: 'Enter password'
            });
        }
        else if(register.repassword==""){
            $ionicPopup.alert({
                title: 'Re-enter password'
            });
        }
        else if(register.password!=register.repassword){
            $ionicPopup.alert({
                title: 'Password not matching'
            });
        }
        else if(register.name==""){
            $ionicPopup.alert({
                title: 'Enter name'
            });
        }
        else if(register.username==""){
            $ionicPopup.alert({
                title: 'Enter name'
            });
        }
       // else if(register.designation==""){
       //     $ionicPopup.alert({
       //         title: 'Enter designation'
       //     });
       // }
       // else if(register.company==""){
       //     $ionicPopup.alert({
       //         title: 'Enter company name'
       //     });
       // }
       // else if(register.startdate==""){
       //     $ionicPopup.alert({
       //         title: 'Enter start date'
       //     });
       // }
       //else if(register.enddate==""){
       //     $ionicPopup.alert({
       //         title: 'Enter end date'
       //     });
       // }
       else{
            $rootScope.loadingShow();
            ajaxService.ajaxCall($rootScope.siteUrl+'common.php', $scope.register).then(function(response) {
                $rootScope.loadingHide();
                if(response.data.status=='success'){
                    $rootScope.userId   =   response.data.user_id;
                    localStorage.setItem('user_id',$rootScope.userId)
                    $ionicPopup.alert({
                        title: 'Registered success fully'
                    });
                    ajaxService.ajaxCall($rootScope.siteUrl+'common.php', {
                        status: 'users'
                    }).then(function(response) {
                        $rootScope.loadingHide();
                        $rootScope.users    =   response.data.users;
                    });
                    $state.go('fly-menu.index');
                } else{
                    $ionicPopup.alert({
                        title: 'Error occured try later'
                    });
                }
            });
        }
    }
})




.controller('IndexCtrl', function($scope, $ionicSideMenuDelegate, $state, $rootScope) {

    if($rootScope.userId==""){
        $state.go('fly-menu.home');
    }

    if(localStorage.getItem('user_id')!=""){
        $state.go('fly-menu.index');
    }


    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

})