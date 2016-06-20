Problem
-------

Company X is developing a new app for student education. Students complete quizzes and their progress is recorded.

Each quiz has 2-4 questions. There are 5 quizzes in total.


Part 1
------

Write a web app that displays the quizzes provided (lessons.json, quizzes.json).

It should have a page to view an individual quiz.


Part 2
------

Allow a student to answer questions in the quizzes and submit an entire quiz once all questions have been answered.


Part 3
------

Students start from Quiz 1 and progress through to Quiz 5. They should only be allowed to access the next quiz (e.g. quiz 2) when they have finished the prior quiz (e.g. quiz 1).


Part 4 (Optional)
-----------------

Add a page to show the student's progress through all the quizzes and their scores for each quiz they have completed.

- - - - - - - - - - - - - - -

Ian Lenehan Notes
------------------
I set the quiz in the style of a single page app, simply using jQuery to update elements.

* Part 1: a list of all quizzes is provided on page load. You view each individual quiz by clicking on a quiz name. On page load, the student is asked to enter their name. This is preserved in local storage and reflected on the page.

* Part 2: A student is presented with the first question and the possible answers. Selecting an answer will indicate whether it's correct or incorrect and update both total points and quiz points.

* Part 3: Only when a quiz is finished, will a student be able to select the next quiz to complete. If they try to select a quiz without completing the previous quiz, they will be instructed to complete the previous quiz first.

* Part 4: Once a quiz has been completed, a student may double check their score by clicking on the quiz name.

Once the quiz has been completed, the student may reset local storage to start again. Otherwise, local storage will persist all data with a page refresh. Reset can only be done when the quiz has been completed. 
