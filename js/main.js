var Quiz = {

  quizzes: '',
  questions: '',
  questionCounter: 0,
  questionIDs: '',
  quiz: '',
  questionArray: '',
  quizID: '',

  getQuiz: function() {
    $.ajax({
      url: "js/quizzes.json",
      type: 'GET',
      dataType: 'json',
    }).done(function(result) {
      Quiz.quizzes = result.quizzes;
    });
  },

  displayQuizTitles: function() {
    // builds the list of all quizes to choose from
    for (var i = 0; i < Quiz.quizzes.length; i++) {
      $('#quiz-list').append('<li class="quiz-list-item" data-quiz=' + Quiz.quizzes[i].id + '>' + Quiz.quizzes[i].title + '</li>');
      localStorage['quizCompleted' + [i + 1]] = false;
      localStorage.userScore = 0;
    }
  },

  getQuestions: function() {
    $.ajax({
      url: "js/questions.json",
      type: 'GET',
      dataType: 'json',
    }).done(function(result) {
      Quiz.questions = result.questions;
      Quiz.displayQuizTitles();
    });
  },

  welcomeMessage: function () {
    swal({
      title: "Hello!",
      text: "Please tell us your first name:",
      type: "input",
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Your first name here"
    }, function(inputValue){
        if (inputValue === false) return false;
        if (inputValue === "") {
               swal.showInputError("You need to write something!");
               return false;
             }
             $('.title').text('Welcome to the Quiz, ' + inputValue + '!');
            swal("Thanks " + inputValue + "!", "Please start at Quiz 1 and work your way though the game. You may remind yourself of your score by clicking on a Quiz title after you have completed it.", "success"); });
  },

  endOfQuiz: function() {
    swal({
      title: "Finished!",
      text: "You scored " + localStorage['quiz' + Quiz.quizID] + " points.",
      type: "success"
    });
    // reset game board
    $('#possible-answers').empty();
    $('#question').empty();
    $('.hide-this').toggle();
    Quiz.questionCounter = 0;
    localStorage['quizCompleted' + Quiz.quizID] = true;
    // if all quizzes completed, add this
    if(localStorage.quizCompleted5 === 'true') {
      $('#questions').append('<h2 id="restart">Congratulations on completing all five quizzes. Click here if you wish to reset all quizzes and try to beat your previous score!</h2>');
    }
  },

  correctAlert: function() {
    swal({
      title: "Correct!",
      text: "You answered correctly!",
      type: "success",
      confirmButtonText: "Next Question"
    }, function() {
      // increase current score
      localStorage.userScore = Number(localStorage.userScore) + 1;
      $('#current-score').text(localStorage.userScore);
      // set up and fetch next question
      Quiz.questionCounter++;
      Quiz.getQuestion(Quiz.questionIDs);

    });
  },

  incorrectAlert: function(correctAnswer) {
    swal({
      title: "Incorrect!",
      text: "The correct answer is " + correctAnswer,
      type: "error",
      confirmButtonText: "Next Question"
    }, function() {
      // set up and fetch next question
      Quiz.questionCounter++;
      Quiz.getQuestion(Quiz.questionIDs);
    });
  },

  getQuestion: function(question) {
    // if last question, run endOfQuiz fn
    if (Quiz.questionCounter >= Quiz.questionIDs.length) {
      setTimeout( function () {
        Quiz.endOfQuiz();
      }, 500);
    } else {
      //get the question with answers
      question = question[Quiz.questionCounter];
      var findQuestion = function(q) {
        return q.id === question;
      };

      Quiz.questionArray = Quiz.questions.find(findQuestion);

      $('#possible-answers').empty();
      $('#question').empty();
      $('#question').append(Quiz.questionArray.question);
      // append possible answers
      for (var i = 0; i < Quiz.questionArray.answers.length; i++) {
        $('#possible-answers').append('<li class="answers" data-answer=' + i + '>' + Quiz.questionArray.answers[i] + '</li>');
      }
    }
  },

  loadQuiz: function(quizID) {
    // check if previous quiz has been completed yet
    var prevCompleted = localStorage['quizCompleted' + (quizID - 1)];
    // check if this quiz has been completed yet
    var thisCompleted = localStorage['quizCompleted' + quizID];
    if (prevCompleted !== 'true' && quizID > 1) {
      // you can't skip ahead
      swal("Not yet!", "Please complete Quiz " + (quizID - 1) + " before attempting this quiz.", "error");
      return;
    } else if (thisCompleted === 'true') {
      // view results of past quizzes
      swal("Results", "You scored " + localStorage['quiz' + quizID] + " points for this quiz.", "success");
      return;
    }

    var findQuiz = function(quiz) {
      // get the details of the quiz when a quiz is selected
      return quiz.id === quizID;
    };
    Quiz.quiz = Quiz.quizzes.find(findQuiz);
    Quiz.questionIDs = Quiz.quiz.question_ids;

    $('.hide-this').toggle();

    // with quiz array, get the first question with answers
    Quiz.getQuestion(Quiz.questionIDs);
  },

  checkAnswer: function(answer) {
    var correctAnswerID = Quiz.questionArray.correct_answer;
    var correctAnswer = Quiz.questionArray.answers[correctAnswerID];
    if (answer === correctAnswerID) {
      // if answer is correct, update or setup local storage for this quiz
      if (localStorage['quiz' + Quiz.quizID]) {
        localStorage['quiz' + Quiz.quizID] = Number(localStorage['quiz' + Quiz.quizID]) + 1;
      } else {
        localStorage['quiz' + Quiz.quizID] = 1;
      }
      Quiz.correctAlert();
    } else {
      Quiz.incorrectAlert(correctAnswer);
    }
  },

  resetQuiz: function () {
    localStorage.clear();
    document.location.reload(true);
  }

};

$(document).ready(function() {

  Quiz.getQuiz();
  Quiz.getQuestions();
  Quiz.welcomeMessage();

  $('body').on('click', '#restart', function () {
    Quiz.resetQuiz();
  });

  $('body').on('click', '.quiz-list-item', function() {
    Quiz.quizID = $(this).data('quiz');
    Quiz.loadQuiz(Quiz.quizID);
  });

  $('body').on('click', '.answers', function() {
    var selected = $(this).data('answer');
    Quiz.checkAnswer(selected);
  });

});
