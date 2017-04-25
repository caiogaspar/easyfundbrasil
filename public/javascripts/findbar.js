var findbar = (function()
{
    var F = {};
    
    F.setDHTML = function()
    {            
      var repos;
      repos = new Bloodhound({
        datumTokenizer: function(d) {return d.tokens},
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //prefetch: '../repos.json'
        prefetch: baseURL + "causas/getCausas"
      });
      console.log(baseURL + "causas/getCausas");

      repos.initialize();        
       $('.typeahead').typeahead(null, {
        name: 'repos',
        source: repos.ttAdapter(),
        templates: {
          suggestion: Handlebars.compile([
            '<p class="repo-language">{{nm_categoria_causa}}</p>',
            '<p class="repo-name">{{nm_causa}}</p>',
            '<p class="repo-description">{{ds_causa}}</p>'
          ].join(''))
        }
      });
    };
    
    $(function()
    {
       F.setDHTML(); 
    });
})();