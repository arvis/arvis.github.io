      var lang="en";
      var other_lang="lv";
      var lang_arr=["en","lv"];
      var correct_answer_count=0;
      var word_data=[];

      function load_word(){
        $("#content").text("");    
        var random_word_id=Math.floor(Math.random() * word_data.length);

        $("#word_to_know").text(word_data[random_word_id][other_lang]);    

        var i=0;
        var correct_answer=Math.floor(Math.random() * 4);
        for (i=0;i<4;i++){

          //TODO: not checking if that answer exists
          var random_id=Math.floor(Math.random() * word_data.length);

          //putting correct answer somewhere
          if (correct_answer==i){
            random_id=random_word_id;
          }


          var button_data=$('<input/>').attr({
              type: "button",
              id: "button_data_"+i,
              class:"btn btn-warning btn-lg btn-block word_choice",
              index_value:i,
              style:"width:100%; margin-bottom:15; margin-top:15;",
              value: word_data[random_id][lang]
          });
          $("#content").append(button_data);    
        }

        $( ".word_choice" ).click(function() {
          var current_index=$(this).attr('index_value');
          if (current_index==correct_answer){
            $( this ).attr("class","btn btn-lg btn-block btn-success");
            correct_answer_count++;
          } else {
            $( this ).attr("class","btn btn-lg btn-block btn-danger");
          }
        });

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
        $("#next_word").click(function() {
          load_word();
        });


      });
  
