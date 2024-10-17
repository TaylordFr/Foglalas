import { Controller, Get, Render, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { FoglalasDto } from './foglalas.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }


  private foglalasok: FoglalasDto[] = [];


  @Get('foglalas')
  @Render('foglalasForm')
  rendel(){
    return {
      data: {},
      errors: []
    }
  }

  @Post('foglalas')
  postFoglalas(@Body() foglalasDto: FoglalasDto, @Res() response: Response){
    const errors: string[] = [];

    if(!foglalasDto.nev || !foglalasDto.email || !foglalasDto.datum || !foglalasDto.idopont || !foglalasDto.letszam){
      errors.push("Minden mezőt meg kell adni!")
    }
    if (foglalasDto.nev && !(/^[A-Za-z]+$/.test(foglalasDto.nev))) {
      errors.push("A név nem megfelelő formátumú!");
    }
    if(foglalasDto.email && !(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-z]{2,}$/.test(foglalasDto.email))){
      errors.push("Az email nem megfelelő formátumú!")
    }
    if(foglalasDto.datum && this.nemMult(foglalasDto.datum) == false){
      errors.push("A dátum nem megfelelő!")
    }
    if(foglalasDto.idopont && /^\d{2}:\d{2}$/.test(foglalasDto.idopont)){
      errors.push("Az időpont nem jól van megadva")
    }
    if(foglalasDto.letszam && parseInt(foglalasDto.letszam) > 10){
      errors.push("Maximum 10 fő lehet")
    } else if(foglalasDto.letszam && parseInt(foglalasDto.letszam) < 0){
      errors.push("Minimum egy főnek kell lennie")
    }

    const ujFoglalas = {
      nev: foglalasDto.nev,
      email: foglalasDto.email,
      datum: foglalasDto.datum,
      idopont: foglalasDto.idopont,
      letszam: foglalasDto.letszam
    }

    if(errors.length > 0){
      response.render('foglalasForm', {
        errors, 
        data: foglalasDto
      })
    }


    this.foglalasok.push(ujFoglalas)
    response.redirect(303, 'foglalasSuccess')

  }


  private nemMult(datum){

    const idate = new Date(datum)

    const mai = new Date();

    mai.setHours(0,0,0,0)

    if(idate >= mai){
      return true
    } else {
      return false
    }

  }

}
