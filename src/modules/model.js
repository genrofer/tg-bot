const { fetchAll, fetch } = require("../utils/postgres")

const USERS = `
SELECT
     *
FROM
     users
`

const NEW_USER = `
INSERT INTO
     users(user_id, name, username, is_active, connected)
VALUES
     ($1 , $2, $3, $4, $5)
RETURNING
     *
`

const DELETE_USER = `
DELETE FROM
     users
where
     user_id = $1
`

const EDIT_USER = `
UPDATE users
SET
     is_active = $1,
     connected = $2
WHERE user_id = $3
`

const users = async () => fetchAll(USERS)
const newUser = async (chatId, name, username, is_active, connected) => fetch(NEW_USER, chatId, name, username, is_active, connected)
const deleteUser = async (id) => fetch(DELETE_USER, id)
const editUser = async (is_active, connected, user_id) => fetch(EDIT_USER, is_active, connected, user_id)

module.exports = {
     users,
     newUser,
     deleteUser,
     editUser
}