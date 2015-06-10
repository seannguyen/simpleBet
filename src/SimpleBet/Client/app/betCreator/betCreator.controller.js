'use-strict';

var app = angular.module('app');

//some static constants
var PATH_TAB_DONE = 'assets/icon_tab_done.png';
var PATH_TAB_UNDONE = 'assets/icon_tab_undone.png';
var PATH_TAB_CURRENT = 'assets/icon_tab_current.png';
var TAB_SIZE = 5;
var TAB_NAMES = ['The Bet', 'The Bet', 'The Wager', 'The Rule', 'The Challengers'];
var TAB_STATES = ['question', 'option', 'wager', 'rule', 'challenger'];

app.controller('betCreatorController', function ($rootScope, $scope, $state, $window, $location, Bet) {
    //navigations
    $scope.currentTab = 0;
    $rootScope.title = TAB_NAMES[$scope.currentTab];

    //bet model
    $scope.betModel = new Bet({ Options: [] });

    //functions
    $scope.getTabStatusIcon = getTabStatusIcon;
    $scope.setTab = setTab;
    $scope.addOption = addOption;
    $scope.removeOption = removeOption;
    $scope.isTypeSelected = isTypeSelected;
    $scope.submitBet = submitBet;

    //DETAIL

	function getTabStatusIcon(tabIndex) {
		if (tabIndex < $scope.currentTab) {
			return PATH_TAB_DONE;
		}
		if (tabIndex === $scope.currentTab) {
			return PATH_TAB_CURRENT;
		}
		return PATH_TAB_UNDONE;
	}

	function setTab(tabIndex) {
		if (tabIndex < TAB_SIZE && tabIndex > -1) {
			$scope.currentTab = tabIndex;
			$rootScope.title = TAB_NAMES[$scope.currentTab];
			$state.go('create.' + TAB_STATES[tabIndex]);
			$window.scrollTo(0,0); 
		}
	}

	function addOption() {
		if(!$scope.input.option || $scope.input.option.lenght <= 0) {
			return;
		}
		$scope.betModel.Options.push($scope.input.option);
		$scope.input.option = '';
	}

	function removeOption(index) {
		$scope.betModel.Options.splice(index, 1);
	}

	function isTypeSelected(optionIndex) {
		//var maxTeamSizeForFirstTeam = $scope.betModel.getMaxTeamSize(0);
		//if (optionIndex === 0 && maxTeamSizeForFirstTeam === 1) {
		//	return true;
		//} else if (optionIndex === 1 && maxTeamSizeForFirstTeam > 1) {
		//	return true;
		//}
		//return false;
	}
    
	function submitBet() {
	    $scope.betModel.$save().then(function() {
	        var ids = [];
	        for (var i = $scope.betModel.Participants.length - 1; i >= 0; i--) {
	            ids.push($scope.betModel.Participants[i].Id);
	        };
	        var tagIds = ids.join(",");

	        FB.api(
                "/me/feed",
                "POST",
                {
                    message: "This is a test message which going to be change: " + $scope.betModel.Question,
                    place: "1424132167909654", //this is our page id TODO: move this to config
                    tags: tagIds,
                    privacy: {
                        value: "SELF"
                    },
                    link: "http://192.168.0.113:9000/#/bet/" + $scope.betModel.Id
                },
                function (response) {
                    console.log(response);
                    if (response && !response.error) {
                        /* handle the result */
                    }
                });
	        $location.path('bet/' + $scope.betModel.Id);
	    });
	}
});