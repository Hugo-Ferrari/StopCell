import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // em produção coloca o endereço do site no CORS_ORIGIN (dá pra separar vários por vírgula)
  const origens = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origem) => origem.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origens,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // a documentação fica aberta só fora de produção (ou se SWAGGER_ENABLED=true)
  const swaggerAtivo =
    process.env.NODE_ENV !== 'production' || process.env.SWAGGER_ENABLED === 'true';

  if (swaggerAtivo) {
    const config = new DocumentBuilder()
      .setTitle('StopCell API')
      .setDescription('Documentação da API do sistema StopCell - TIC')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((erro) => {
  console.error('Falha ao iniciar a API', erro);
  process.exit(1);
});
