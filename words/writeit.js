      var lang="en";
      var other_lang="lv";
      var lang_arr=["en","lv"];
      var correct_answer_count=0;
      var word_data=[];
      var random_word_id=0;

      function load_word(){
        $("#content").text("");    
        $("#is_correct").text("No answer yet");
        $("#answer_info").attr("class","bg-warning col-sm-6 col-lg-4");

        random_word_id=Math.floor(Math.random() * word_data.length);

        $("#word_to_know").text(word_data[random_word_id][other_lang]);    

      }

      function check_answer(){
        var users_answer=$("#answer").val().toLowerCase();
        console.log(users_answer+"-"+word_data[random_word_id][lang]);
        if (users_answer===word_data[random_word_id][lang] ) {
          $("#is_correct").text("Correct! ")+word_data[random_word_id][lang];
          $("#answer_info").attr("class","bg-success col-sm-6 col-lg-4");
        } else {
          $("#is_correct").text("Not correct! - "+word_data[random_word_id][lang]);
          $("#answer_info").attr("class","bg-danger col-sm-6 col-lg-4");
        }
        $("#answer").val("");

      }


      jQuery(function($){

        $.getJSON( "data.json", function( data ) {
          var items = [];
          word_data=data;
          load_word();

        });

        $("input:radio[name=lang]").click(function() {
            lang = $(this).val();

            //FIXME: bad code, need something more elegant
            if (lang=="en"){
              other_lang="lv";
            } else {
              other_lang="en";
            }
            load_word();
        });
        $("#submit_answer").click(function() {
          check_answer();
        });

        $("#next_word").click(function() {
          load_word();
        });


      });
  
