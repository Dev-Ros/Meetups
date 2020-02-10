// Importing files and packages
import 'package:flutter/material.dart';
import 'package:to_do/task.dart';

//
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'To Do App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'To Do App'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var taskList = new List<Task>();
  // TextEditingController is necessary to store input data from the alert dialog
  TextEditingController _textFieldController = TextEditingController();

  _displayDialog(BuildContext context) async {
    return showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('New Task'),
            content: TextField(
              autofocus: true,
              controller: _textFieldController,
            ),
            actions: <Widget>[
              new FlatButton(
                child: new Text('Add'),
                onPressed: () {
                  // add the task to the list
                  if (_textFieldController.value.text != "")
                    addTask(_textFieldController.value.text);
                  _textFieldController.clear();
                  Navigator.of(context).pop();
                },
              )
            ],
          );
        });
  }

  void addTask(String content) {
    // setState is always necessary to update UI
    this.setState(() {
      taskList.add(new Task(content));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: ListView.builder(
        itemBuilder: (BuildContext context, int index) {
          return ListTile(
            // check or uncheck task
            leading: Checkbox(
                activeColor: Colors.green,
                value: taskList[index].isDone,
                onChanged: (bool value) {
                  setState(() {
                    taskList[index].isDone = value;
                  });
                }),
            title: Text(
              taskList[index].content,
              style: TextStyle(
                fontSize: 18.0,
                decoration: taskList[index].isDone
                    ? TextDecoration.lineThrough
                    : TextDecoration.none,
              ),
            ),
            trailing: IconButton(
              icon: Icon(Icons.delete),
              onPressed: () {
                setState(() {
                  taskList.removeAt(index);
                });
              },
            ),
          );
        },
        itemCount: taskList.length,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _displayDialog(context),
        child: Icon(Icons.add),
      ),
    );
  }
}
