Feature: Sign in with Google
  As a user
  I want to sign in using a Google ID token
  So that I can access the system securely

  Scenario: User signs in successfully with a valid token
    Given I have a valid Google ID token
    When I send a POST request to "/user/sign-in-with-google"
    Then I should receive a 201 response
    And the response should contain the signed-in user

  Scenario: Sign-in fails because Google token is invalid
    Given I have an invalid Google ID token
    When I send a POST request to "/user/sign-in/google"
    Then I should receive a 404 response