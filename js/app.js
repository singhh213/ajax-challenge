"use strict";


var reviewsUrl = 'https://api.parse.com/1/classes/reviews';

angular.module('ProductReview', ['ui.bootstrap'])
    .config(function($httpProvider) {
        
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '4cPKj6vDN36VPI8aCZg6PQ0cevcxOT3XvG4FHYsG';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'fmgOcJAYCVJO8UUgw05580IIM7vvwCRTdQe8SMIz';
    })

    .controller('ReviewsController', function($scope, $http) {
        //refreshes the list of comments by getting feed from parse.com
        $scope.refreshReviews = function() {
            $http.get(reviewsUrl + '?order=-votes')
                .success(function(data) {
                    $scope.reviews = data.results;
                });
        };

        $scope.refreshReviews();

        //each new review is given the delete property of false
        //so that it won't be deleted.
        $scope.newReview = {remove: false};

        //the variable for checking if a review was added successfully
        $scope.successfulFeed = false;

        //adds the review data to parse.com
        $scope.addReview = function() {
            $scope.inserting = true;
            $http.post(reviewsUrl, $scope.newReview)
                .success(function(responseData) {
                    $scope.newReview.objectId = responseData.objectId;
                    $scope.reviews.push($scope.newReview);
                    $scope.newReview = {remove: false};
                    $scope.successfulFeed = true;
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        //updates the review data on parse.com
        $scope.updateReview = function(review) {
            $scope.updating = true;
            $http.put(reviewsUrl + '/' + review.objectId, review)
                .success(function() {
                    console.log("success")
                })

                .error(function(err) {
                    console.log(err);
                })

                .finally(function() {
                    $scope.updating = false;
                });
        };

        //increments/decrements the vote count for the specified review
        $scope.incrementVotes = function(review, amount) {
            $scope.updating = true;
            var postData = {
                votes: {
                    __op: "Increment",
                    amount: amount
                }
            };

            $http.put(reviewsUrl + '/' + review.objectId, postData)
                .success(function(respData) {
                    review.votes = respData.votes;
                })
                
                .error(function(err) {
                    console.log(err);
                })

                .finally(function() {
                    $scope.updating = false;
                });
        };

        //deletes the specified review from parse.com and the webpage.
        $scope.removalUpdate = function(review) {
            if (review.remove == true) {
                $http.delete(reviewsUrl + '/' + review.objectId)
                    .success(function() {
                        $scope.refreshReviews()
                    })
                    .error(function(err) {
                        console.log(err);
                    });  
            }
        }
    });

