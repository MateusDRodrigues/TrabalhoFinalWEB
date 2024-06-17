function calcular() {
    var idade = parseInt(document.getElementById('idade').value);
    var peso = parseInt(document.getElementById('peso').value);
    var altura = parseInt(document.getElementById('altura').value);

    if (isNaN(idade) || isNaN(peso) || isNaN(altura) || idade <= 0 || peso <= 0 || altura <= 0) {
        alert('Por favor, insira valores válidos para idade, peso e altura.');
        return;
    }

    var resultados = calcularResultados(idade, peso, altura);
    exibirResultados(resultados);
}

function calcularResultados(idade, peso, altura) {
    var alturaM = altura / 100;  // Converter altura para metros
    var imc = peso / (alturaM * alturaM);  // Calcular o IMC corretamente

    // Regras de negócio da Operadora de Saúde A
    var planoA_basico = 100 + (idade * 10 * (imc / 10));
    var planoA_padrao = (150 + (idade * 15)) * (imc / 10);
    var planoA_premium = (200 - (imc * 10) + (idade * 20)) * (imc / 10);

    // Regras de negócio da Operadora de Saúde B
    var fatorComorbidade = 1;
    if (imc < 18.5) {
        fatorComorbidade = 10;
    } else if (imc >= 25 && imc < 30) {
        fatorComorbidade = 6;
    } else if (imc >= 30 && imc < 35) {
        fatorComorbidade = 10;
    } else if (imc >= 35 && imc < 40) {
        fatorComorbidade = 20;
    } else if (imc >= 40) {
        fatorComorbidade = 30;
    }

    var planoB_basico = 100 + (fatorComorbidade * 10 * (imc / 10));
    var planoB_padrao = (150 + (fatorComorbidade * 15)) * (imc / 10);
    var planoB_premium = (200 - (imc * 10) + (fatorComorbidade * 20)) * (imc / 10);

    return {
        planoA: {
            basico: planoA_basico,
            padrao: planoA_padrao,
            premium: planoA_premium,
        },
        planoB: {
            basico: planoB_basico,
            padrao: planoB_padrao,
            premium: planoB_premium,
        },
    };
}

function exibirResultados(resultados) {
    var tabelaResultados = "<h3 class='mt-4'>Resultados</h3>";
    tabelaResultados += "<table class='table'><thead><tr><th>Plano</th><th>Operadora A</th><th>Operadora B</th></tr></thead><tbody>";
    tabelaResultados += "<tr><td>Básico</td><td>R$ " + formatarNumero(resultados.planoA.basico) + "</td><td>R$ " + formatarNumero(resultados.planoB.basico) + "</td></tr>";
    tabelaResultados += "<tr><td>Padrão</td><td>R$ " + formatarNumero(resultados.planoA.padrao) + "</td><td>R$ " + formatarNumero(resultados.planoB.padrao) + "</td></tr>";
    tabelaResultados += "<tr><td>Premium</td><td>R$ " + formatarNumero(resultados.planoA.premium) + "</td><td>R$ " + formatarNumero(resultados.planoB.premium) + "</td></tr>";
    tabelaResultados += "</tbody></table>";

    var melhorPlanoA = encontrarMelhorPlano(resultados.planoA);
    var melhorPlanoB = encontrarMelhorPlano(resultados.planoB);

    tabelaResultados += "<p class='mt-4'>Melhor Plano:</p>";
    tabelaResultados += "<p>Operadora A: <span class='melhor-plano'>" + melhorPlanoA.plano + " (" + formatarNumero(melhorPlanoA.valor) + ")</span></p>";
    tabelaResultados += "<p>Operadora B: <span class='melhor-plano'>" + melhorPlanoB.plano + " (" + formatarNumero(melhorPlanoB.valor) + ")</span></p>";

    document.getElementById('tabelaResultados').innerHTML = tabelaResultados;
}

function encontrarMelhorPlano(planos) {
    var melhorPlano = Object.keys(planos).reduce(function (melhor, plano) {
        if (planos[plano] < melhor.valor) {
            return { plano: plano, valor: planos[plano] };
        } else {
            return melhor;
        }
    }, { plano: '', valor: Infinity });

    return melhorPlano;
}

function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
