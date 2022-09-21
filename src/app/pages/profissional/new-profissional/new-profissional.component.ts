import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Estabelecimento } from 'src/app/model/estabelecimento.model';
import { Profissional } from 'src/app/model/profissional.model';
import { EstabelecimentoService } from 'src/app/service/estabelecimento.service';
import { ProfissionalService } from 'src/app/service/profissional.service';
import { ToastUtilService } from 'src/app/service/toast-util.service';

@Component({
  selector: 'app-new-profissional',
  templateUrl: './new-profissional.component.html',
  styleUrls: ['./new-profissional.component.scss'],
})
export class NewProfissionalComponent implements OnInit {
  profissional: Profissional;
  profissionalForm: FormGroup;
  estabelecimentos: Profissional[] = [];
  selectedEstabelecimentos: Profissional[] = [];
  loading: boolean;

  constructor(
    private router: Router,
    private estabelecimentoService: EstabelecimentoService,
    private service: ProfissionalService,
    private toastUtil: ToastUtilService
  ) {
    this.loading = true;
    this.profissional = {};
    this.profissionalForm = new FormGroup({
      nome: new FormControl(''),
      funcao: new FormControl(''),
      celular: new FormControl(''),
      residencial: new FormControl(''),
      rua: new FormControl(''),
      bairro: new FormControl(''),
      numero: new FormControl(''),
      estabelecimentos: new FormControl([]),
    });

    this.fillEstabelecimentos();
  }

  fillEstabelecimentos() {
    this.estabelecimentoService.getEstabelecimentos().subscribe(
      (res) => {
        this.estabelecimentos = res.content;
        this.loading = false;
      },
      (err: any) => {
        this.toastUtil.showError(err);
      }
    );
  }

  setEstabelecimentos() {
    (this.profissionalForm.value.estabelecimentos as number[]).map((id) => {
      this.selectedEstabelecimentos.push({
        id,
      });
    });
    this.profissionalForm.patchValue({
      estabelecimentos: this.selectedEstabelecimentos,
    });
  }

  onSubmit() {
    this.setEstabelecimentos();
    let profissional: Profissional = this.profissionalForm.value;
    profissional = {
      ...profissional,
      funcao: this.profissionalForm.value.funcao,
      endereco: {
        rua: this.profissionalForm.value.rua,
        bairro: this.profissionalForm.value.bairro,
        numero: this.profissionalForm.value.numero,
      },
      numero: {
        celular: this.profissionalForm.value.celular,
        residencial: this.profissionalForm.value.residencial,
      },
    };
    this.service.createProfissional(profissional).subscribe(
      () => {
        this.toastUtil.showSuccess(
          'Sucesso',
          'Profissional criado com sucesso.'
        );
        this.goBack();
      },
      (err) => {
        this.toastUtil.showError(err);
      }
    );
  }

  goBack() {
    this.router.navigateByUrl('profissionais');
  }

  ngOnInit(): void {}
}
