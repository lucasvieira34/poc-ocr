import * as FormData from 'form-data';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { OcrImageResponse } from 'src/application/model/ocr/ocr-image-response.model';
import { OcrAnalyzeResponse } from 'src/application/model/ocr/ocr-analyze-response.model';

const logger = new Logger('OcrClient');

const ocrApi = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.TOKEN,
  },
});

const syncOcr = async (image: Express.Multer.File): Promise<any> => {
  try {
    const form = new FormData();
    form.append('image', image.buffer, image.mimetype);
    const response = await ocrApi.post('/ocr?language=pt&detectOrientation=true', form);
    return response.data;
  } catch (err) {
    logger.error(`ERROR: ${err?.response?.data?.error?.message}`);
    const status = err?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(err?.response?.data || { message: err.message, status }, status);
  }
};

const asyncOcr = async (image: Express.Multer.File): Promise<OcrImageResponse> => {
  try {
    const response = await ocrApi.post('/read/analyze?language=pt&detectOrientation=true', image.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    return new OcrImageResponse().setAnalyzeId(response.headers['apim-request-id']).setStatus(response.status);
  } catch (err) {
    logger.error(`ERROR: ${err?.response?.data?.error?.message}`);
    const status = err?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(err?.response?.data || { message: err.message, status }, status);
  }
};

const getAnalyzeResultsByOcr = async (analyzeId: string): Promise<OcrAnalyzeResponse> => {
  try {
    const response = await ocrApi.get(`/read/analyzeResults/${analyzeId}`);
    return response.data;
  } catch (err) {
    logger.error(`ERROR: ${err?.response?.data?.error?.message}`);
    const status = err?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(err?.response?.data || { message: err.message, status }, status);
  }
};

export { syncOcr, asyncOcr, getAnalyzeResultsByOcr };
