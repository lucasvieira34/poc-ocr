import { Body, Controller, Get, HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpLoggingInterceptor } from '../interceptor/http-logging.interceptor';
import { AnalyzeTexts } from '../model/analyze-texts.model';
import { OcrImageResponse } from '../model/ocr/ocr-image-response.model';
import { TypeEnum } from '../model/enum/ocr-type.enum';
import { AppService } from '../service/app.service';
import { InvoiceModel } from '../model/invoice.model';

@Controller('cognitive-service')
@UseInterceptors(HttpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('/image')
  @HttpCode(202)
  public async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('type') typeEnum: string,
  ): Promise<OcrImageResponse> {
    if (typeEnum === TypeEnum.SYNC) {
      return await this.appService.sendToSynchronousOcr(image);
    } else {
      return await this.appService.sendToAsynchronousOcr(image);
    }
  }

  @Get('/read/analyzeResults/:analyzeId')
  public async getOcrResults(@Param('analyzeId') analyzeId: string): Promise<AnalyzeTexts> {
    return await this.appService.getAnalyzeResultsByOcr(analyzeId);
  }

  @Get('/nota-fiscal/:analyzeId')
  public async getDadosNotaFiscalByTemplate(@Param('analyzeId') analyzeId: string): Promise<InvoiceModel> {
    return await this.appService.getDadosNotaFiscalByTemplate(analyzeId);
  }
}
