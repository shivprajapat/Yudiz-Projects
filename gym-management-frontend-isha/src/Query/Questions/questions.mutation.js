import Axios from '../../axios'

export async function addQuestion(data) {
  return Axios.put('/v1/question/add', data)
}

export async function updateQuestion({ questionId, newData }) {
  return Axios.patch(`/v1/question/edit/${questionId}`, newData)
}

export function deleteQuestion(id) {
  return Axios.delete(`/v1/question/delete/${id}`)
}
