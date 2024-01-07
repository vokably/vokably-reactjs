# Vokably.com

Vokably is a "basic" Vocabulary training app that I develop on my free time.

It is originaly design for english speaker to learn norwegian

I then upgrade it for ukrainian speaker to learn norwegian

# TODO
I believe it is important to track the ideas I have to improve the app. Ultimately I would like people to be able to track their improvement. Meaning that they can:
- Check the number of word they have learnt since they start using the app
- Check total number of word they have seen
- Make custom learning session to train on the words they make most mistake
- Check their global average answer time or for specific session
- Have grade / badge depending on their advancement on the vocabulary list
- Track the time they spend on the app

However to be able to da that, I will need to add two very important features:
- An user login system to store user statistics somewhere else than in the localStorage
- An user dashboard screen

Ultimately, I would like to also have an Mobile App, Hence I am thinking to use the Firebase Baas (Backend As A Service)

## TODO
- [ ] Implement the learning session on local storage first
    - [ ] React Context to current store learning session information
    - [ ] Basic screen to visualize independant and global learning session

- [ ] Implement the backend
    - [ ] Implement a sign in / sign up page (Firebase Authentification)
    - [ ] Add learning session cloud storage (Cloud Firestore)
    - [ ] Implement the user Dashboard to monitor user statistics
    - [ ] Implement landing page for the web version

## Exercice
There is only two mode so far:
1. `cross`: A classic exercice inspired from Duolinguo, were you are presented with two column of 5 words and you need to match them together.
2. `table`: A basic table to display each word and their translation. The user can hide / display the translation in order to practice by himself.

## Statistics
> :warning: This is my own personnal asumption, and could be completly wrong. Once I have more data, I will definitly consolidate those theories

1. I consider a word being learn when I have succesfully translate (in `cross`) 5 times the same words. If I make a mistake, the counter is reset to 0 and the word is "unlearnt"
2. The response time is also something important. By response time I mean the time taken to match to words together
    - \> 5 seconds: The word is not learn (I used the help)
    - \> 2 seconds < 5: The word is learn but not usable in conversation (need to think of the translation)
    - < 2 seconds: The word is learn and totally usable in conversation
    - < 1 second: The word is completely learnt and the translation is like a reflex (fluent level)

