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
      url: "quizzes.json",
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
      url: "questions.json",
      type: 'GET',
      dataType: 'json',
    }).done(function(result) {
      Quiz.questions = result.questions;
      Quiz.displayQuizTitles();
    });
  },

  endOfQuiz: function() {
    swal({
      title: "Finished!",
      text: "You scored " + localStorage['quiz' + Quiz.quizID] + " points.",
      type: "success"
    });
    $('#possible-answers').empty();
    $('#question').empty();
    Quiz.questionCounter = 0;
    localStorage['quizCompleted' + Quiz.quizID] = true;
  },

  correctAlert: function() {
    swal({
      title: "Correct!",
      text: "You answered correctly!",
      type: "success",
      confirmButtonText: "Next Question"
    }, function() {
      localStorage.userScore = Number(localStorage.userScore) + 1;
      $('#current-score').text("Current Score: " + localStorage.userScore);
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
      Quiz.questionCounter++;
      Quiz.getQuestion(Quiz.questionIDs);
    });
  },

  getQuestion: function(question) {
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
      swal("Not yet!", "Please complete Quiz " + (quizID - 1) + " before attempting this quiz.", "error");
      return;
    } else if (thisCompleted === 'true') {
      swal("Hold up!", "You've already completed this quiz. Nice try.", "error");
      return;
    }
    // get the details of the quiz when a quiz is selected
    var findQuiz = function(quiz) {
      return quiz.id === quizID;
    };
    Quiz.quiz = Quiz.quizzes.find(findQuiz);
    Quiz.questionIDs = Quiz.quiz.question_ids;

    // with quiz array, get the first question with answers
    Quiz.getQuestion(Quiz.questionIDs);

  },

  checkAnswer: function(answer) {
    var correctAnswerID = Quiz.questionArray.correct_answer;
    var correctAnswer = Quiz.questionArray.answers[correctAnswerID];
    if (answer === correctAnswerID) {
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

  resetLocalStorage: function () {
    localStorage.clear();
  }

};

$(document).ready(function() {

  Quiz.getQuiz();
  Quiz.getQuestions();
  Quiz.resetLocalStorage();

  $('body').on('click', '.quiz-list-item', function() {
    Quiz.quizID = $(this).data('quiz');
    Quiz.loadQuiz(Quiz.quizID);
  });

  $('body').on('click', '.answers', function() {
    var selected = $(this).data('answer');
    Quiz.checkAnswer(selected);
  });

});