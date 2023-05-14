import { Badge, Button, Col, Container, Form, FormControl, FormGroup, ListGroup, Row, Stack } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_REACT_SOCKET)

function App () {
  const [from, setFrom] = useState()
  const [receivedMessage, setReceivedMessage] = useState([])

  // recibo mensaje del backend
  useEffect(() => {
    socket.on('backMessage', recibirMensajes)
    return () => socket.off('backMessage', recibirMensajes)
  }, [receivedMessage])

  const recibirMensajes = (message) => {
    setReceivedMessage([...receivedMessage, message])
  }

  // envio de mensaje al backend
  const handleSubmit = (event) => {
    event.preventDefault()

    const form = Object.fromEntries(new window.FormData(event.target))
    form.message = form.message.trim()
    form.from = form.from.trim()

    if (form.from && form.message) {
      socket.emit('frontMessage', form)

      setReceivedMessage([...receivedMessage, form])

      setFrom(event.target.from.value)
      event.target.message.value = ''
    }
  }

  const ChatMessage = (message, index, from) => {
    if (from === message.from) {
      return (
        <ListGroup.Item key={index} variant='secondary' className='text-end'>
          <span> {message.message} </span>
          <Badge className='fw-bold'>{message.from}</Badge>
        </ListGroup.Item>
      )
    } else {
      return (
        <ListGroup.Item key={index} variant='success'>
          <Badge bg='success' className='fw-bold'>{message.from}</Badge>
          <span> {message.message} </span>
        </ListGroup.Item>
      )
    }
  }

  return (
    <Container style={{ backgroundColor: '#111b21' }}>
      <Stack className='text-center'><h1>Chat Web</h1></Stack>
      <Row className='my-3'>
        <Col>
          <ListGroup variant='flush'>
            {
               receivedMessage?.map((message, index) => ChatMessage(message, index, from))
            }
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Form.Label>Usuario: <FormControl name='from' required /></Form.Label>
              <FormControl name='message' required />
            </FormGroup>
            <div className='d-flex justify-content-end'><Button className='my-1' variant='success' type='submit'>Enviar</Button></div>
          </Form>
        </Col>
      </Row>
    </Container>

  )
}

export default App
