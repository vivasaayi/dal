1. DB Connection is made at the start of the app and its reused.
2. We are using Mongo Object Ids. All documents passed for insert/update should have ids.
    2.1. But they are stored as strings.

Issues:
1. What happens, if the DB is disconnected in the middle?