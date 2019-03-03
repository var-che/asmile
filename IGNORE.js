let schema = {
  "_id" : ObjectId("4faaba123412d654fe83hg876"),
  "user_id" : 123456,
  "total" : 100,
  "courses" : [
    {
      name: 'tech',
      data: [
        { active: false, blabla: []},
        { active: false, blabla: []},
        { active: true /*change to false*/, blabla: [/* add item here*/]}
      ]
    }
  ]
}