graphData = {
  "nodes":
  [
    {
      "type" : "movies",
      "count": 100,
      "properties":
      [
        {
          "type": "name", 
          "count": 80, 
          "optional": false
        }
      ]
    },
    {
      "type" : "people",
      "count": 80
    },
    {
      "type" : "dogs",
      "count": 30
    }
  ],
  "edges":
  [
    {
      "type" : "is_owned_by",
      "count": 20,
      "connections":
      [
        {
          "source" : "people",
          "target" : "dogs",
          "count"  : 20
        }
      ]
    },
    {
      "type" : "directs",
      "count": 50,
      "connections":
      [
        {
          "source" : "people",
          "target" : "movies",
          "count"  : 20
        },
        {
          "source" : "people",
          "target" : "people",
          "count"  : 50
        }
      ]
    },
    {
      "type": "stars",
      "count": 60,
      "connections":
      [
        {
          "source" : "people",
          "target" : "movies",
          "count"  : 80
        },
        {
          "source" : "dogs",
          "target" : "movies",
          "count"  : 40
        }
      ]
    },
    {
      "type": "knows",
      "count": 80,
      "connections":
      [
        {
          "source" : "people",
          "target" : "people",
          "count"  : 80
        }
      ]
    },
    {
      "type": "references",
      "count": 30,
      "connections":
      [
        {
          "source" : "movies",
          "target" : "movies",
          "count"  : 20
        },
        {
          "source" : "people",
          "target" : "movies",
          "count"  : 10
        }
      ]
    },
    {
      "type": "once_saw_at_a_party",
      "count": 20,
      "connections":
      [
        {
          "source" : "people",
          "target" : "people",
          "count"  : 40
        }
      ]
    }
  ]
}
