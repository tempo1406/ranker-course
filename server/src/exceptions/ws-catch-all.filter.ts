import { ArgumentsHost, BadRequestException, ExceptionFilter } from '@nestjs/common';
import { SocketWithAuth } from 'src/polls/types';
import { WsBadRequestException, WsUnknownException } from './ws-exceptions';

export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData['message'] ?? exceptionData ?? exception.name;

      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
