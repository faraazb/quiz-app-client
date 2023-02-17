# Question

This component provides a Question which has
- Heading (text)
- Title (Input)
- Option
- Delete Button

| props | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `heading` | `string` | text for question heading |
| `removeOnClickHandler` | `callBackfn` | This function is called after onClick on delete button |
| `parentKey` | `string` | key of parent |

#### removeOnClickHandler(event, parentKey)

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `event`      | `object` | onclick event|
| `parentKey`      | `string` | parent key |