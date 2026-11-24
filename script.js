

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("form-dupla");

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            // Impede o navegador de recarregar a página
            evento.preventDefault();

            // Pega os nomes digitados
            const aluno1 = document.getElementById("aluno1").value.trim();
            const aluno2 = document.getElementById("aluno2").value.trim();

            // Verifica se os nomes foram preenchidos
            if (aluno1 === "" || aluno2 === "") {

                alert("Por favor, informe o nome dos dois alunos.");

                return;
            }

            // Cria um objeto com as informações da dupla
            const dupla = {
                aluno1: aluno1,
                aluno2: aluno2
            };

            // Limpa os dados de uma atividade anterior
            sessionStorage.removeItem("memorialConteudo");
            sessionStorage.removeItem("pokemonsSorteados");
            sessionStorage.removeItem("pokemonsJaInseridos");
            sessionStorage.removeItem("entregaId");
            sessionStorage.removeItem("entregaEnviada");
            // Salva a dupla no navegador
            sessionStorage.setItem("dupla", JSON.stringify(dupla));

            // Vai para a página do memorial
            window.location.href = "memorial.html";
        });
    }


    const boasVindas = document.getElementById("boas-vindas");

    if (boasVindas) {

        // Recupera os dados da dupla
        const dadosSalvos = sessionStorage.getItem("dupla");

        // Se não existir uma dupla, volta para o início
        if (!dadosSalvos) {

            window.location.href = "index.html";

            return;

        } else {

            const dupla = JSON.parse(dadosSalvos);

            // Mostra os nomes na tela
            boasVindas.textContent =
                `Dupla: ${dupla.aluno1} + ${dupla.aluno2}`;
        }
    }

    const areaEditor = document.getElementById("editor");

    if (areaEditor) {

        // Cria o editor Quill
        const editor = new Quill("#editor", {

            theme: "snow",

            modules: {

                toolbar: [
                    ["bold", "italic", "underline"],

                    [
                        {
                            header: [1, 2, 3, false]
                        }
                    ],

                    [
                        {
                            list: "ordered"
                        },
                        {
                            list: "bullet"
                        }
                    ],

                    ["clean"]
                ]
            }
        });

        // Guarda o editor para utilizarmos depois
        window.editorMemorial = editor;

        // Verifica se existe um texto salvo anteriormente
        const textoSalvo = sessionStorage.getItem("memorialConteudo");

        if (textoSalvo) {
            editor.root.innerHTML = textoSalvo;
        } else if (window.conteudoMemorial) {
            editor.clipboard.dangerouslyPasteHTML(window.conteudoMemorial);
        }

        // Sempre que os alunos modificarem o documento,
        // salvamos automaticamente o conteúdo atualizado.
        editor.on("text-change", function () {

            const conteudoAtual = editor.root.innerHTML;

            sessionStorage.setItem(
                "memorialConteudo",
                conteudoAtual
            );

        });
    }


    // ==========================================
    // SORTEIO DOS POKÉMON
    // ==========================================

    function sortearPokemons() {

        // Sorteia o primeiro Pokémon
        const indice1 = Math.floor(
            Math.random() * listaPokemon.length
        );

        // Sorteia o segundo Pokémon
        let indice2 = Math.floor(
            Math.random() * listaPokemon.length
        );

        // Garante que os dois sejam diferentes
        while (indice2 === indice1) {

            indice2 = Math.floor(
                Math.random() * listaPokemon.length
            );
        }

        return {
            pokemon1: listaPokemon[indice1],
            pokemon2: listaPokemon[indice2]
        };
    }
    // ==========================================
    // INSERIR POKÉMON NO TEXTO
    // ==========================================


    function inserirPokemonsNoTexto(pokemon1, pokemon2) {
        const editor = window.editorMemorial;
        const texto = editor.getText().trim();

        const palavras = [...texto.matchAll(/\S+/g)];

        if (palavras.length < 4) {
            console.log("Texto muito curto para inserir os Pokémon.");
            return;
        }

        // Escolhe duas palavras diferentes
        let indice1 = Math.floor(Math.random() * palavras.length);
        let indice2 = Math.floor(Math.random() * palavras.length);

        while (indice2 === indice1) {
            indice2 = Math.floor(Math.random() * palavras.length);
        }

        // Organiza as posições da maior para a menor
        const insercoes = [
            {
                posicao: palavras[indice1].index + palavras[indice1][0].length,
                pokemon: pokemon1
            },
            {
                posicao: palavras[indice2].index + palavras[indice2][0].length,
                pokemon: pokemon2
            }
        ];

        insercoes.sort((a, b) => b.posicao - a.posicao);

        // Insere os Pokémon sem alterar a formatação
        insercoes.forEach(function (item) {
            editor.insertText(item.posicao, " " + item.pokemon + " ");
        });

        console.log("Pokémon inseridos corretamente.");
    }


    // ==========================================
    // SORTEIO E INSERÇÃO DOS POKÉMON
    // ==========================================

    if (typeof listaPokemon !== "undefined" && areaEditor) {

        // Verifica se já existe um sorteio salvo
        const sorteioSalvo =
            sessionStorage.getItem("pokemonsSorteados");

        let pokemonsSorteados;

        if (sorteioSalvo) {

            // Recupera os mesmos Pokémon
            pokemonsSorteados = JSON.parse(sorteioSalvo);

            console.log("Pokémon recuperados:");
            console.log(
                "Pokémon 1:",
                pokemonsSorteados.pokemon1
            );
            console.log(
                "Pokémon 2:",
                pokemonsSorteados.pokemon2
            );

        } else {

            // Faz um novo sorteio
            pokemonsSorteados = sortearPokemons();

            // Salva os Pokémon
            sessionStorage.setItem(
                "pokemonsSorteados",
                JSON.stringify(pokemonsSorteados)
            );

            //console.log("Novos Pokémon sorteados:");
            //console.log(
                //"Pokémon 1:",
                //pokemonsSorteados.pokemon1
            //);
            //console.log(
               // "Pokémon 2:",
                //pokemonsSorteados.pokemon2
            //);
        }

        // Verifica se os Pokémon já foram inseridos
        const pokemonsJaInseridos =
            sessionStorage.getItem("pokemonsJaInseridos");

        if (!pokemonsJaInseridos) {

            // Insere os Pokémon apenas uma vez
            inserirPokemonsNoTexto(
                pokemonsSorteados.pokemon1,
                pokemonsSorteados.pokemon2
            );

            // Marca que a inserção já aconteceu
            sessionStorage.setItem(
                "pokemonsJaInseridos",
                "true"
            );

        } else {

            console.log(
                "Os Pokémon já foram inseridos anteriormente."
            );
        }
    }


    // ==========================================
    // FINALIZAR MEMORIAL
    // ==========================================

    const botaoFinalizar =
        document.getElementById("botao-continuar");

    if (botaoFinalizar) {

        botaoFinalizar.addEventListener("click", function () {

            // Verifica se o editor existe
            if (!window.editorMemorial) {

                alert("O editor não foi carregado corretamente.");

                return;
            }

            // Pega o conteúdo do editor
            const conteudo =
                window.editorMemorial.root.innerHTML;

            // Salva o conteúdo temporariamente
            sessionStorage.setItem(
                "memorialConteudo",
                conteudo
            );

            // Vai para a página de entrega
            window.location.href = "entrega.html";
        });
    }


    // ==========================================
    // PÁGINA DE ENTREGA
    // ==========================================

    const resumoDupla =
        document.getElementById("resumo-dupla");

    if (resumoDupla) {

        const dadosSalvos =
            sessionStorage.getItem("dupla");

        // Se não existir uma dupla, volta para o início
        if (!dadosSalvos) {

            window.location.href = "index.html";

            return;

        } else {

            const dupla = JSON.parse(dadosSalvos);

            // Mostra os nomes da dupla
            resumoDupla.innerHTML = `
                <p>
                    <strong>Dupla:</strong>
                    ${dupla.aluno1} + ${dupla.aluno2}
                </p>
            `;
        }
    }

    const botaoEnviar = document.getElementById("botao-enviar");

    if (botaoEnviar) {
        botaoEnviar.addEventListener("click", function () {

            // Impede um novo envio se já foi concluído
            if (sessionStorage.getItem("entregaEnviada") === "true") {
                alert("Esta entrega já foi enviada!");
                return;
            }

            // Impede cliques enquanto o envio está acontecendo
            if (botaoEnviar.disabled) {
                return;
            }

            const respostaPokemon1 =
                document.getElementById("pokemon1").value.trim();

            const respostaPokemon2 =
                document.getElementById("pokemon2").value.trim();
            if (respostaPokemon1 === "" || respostaPokemon2 === "") {
                alert("Por favor, informe o nome dos dois Pokémon encontrados.");
                return;
            }

            sessionStorage.setItem("respostaPokemon1", respostaPokemon1);
            sessionStorage.setItem("respostaPokemon2", respostaPokemon2);

            // Cria um identificador único para esta entrega
            // O mesmo identificador será reutilizado em caso de tentativa novamente
            let entregaId = sessionStorage.getItem("entregaId");

            if (!entregaId) {
                entregaId =
                    Date.now() + "-" + Math.random().toString(36).substring(2);

                sessionStorage.setItem("entregaId", entregaId);
            }

            const entrega = {
                entregaId: entregaId,
                dupla: JSON.parse(sessionStorage.getItem("dupla")),
                memorial: sessionStorage.getItem("memorialConteudo"),
                pokemonsSorteados: JSON.parse(
                    sessionStorage.getItem("pokemonsSorteados")
                ),
                respostaPokemon1: respostaPokemon1,
                respostaPokemon2: respostaPokemon2,
                data: new Date().toISOString()
            };

            sessionStorage.setItem("entregaFinal", JSON.stringify(entrega));

            // Desativa o botão durante o envio
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Enviando...";

            fetch("https://script.google.com/macros/s/AKfycbxBNNaadK7u9PtnHm0-6fq40Solwz6sHYp5EKgq1PyvflAAy0dZi53twpmJzMX1pIvi1A/exec", {
                method: "POST",
                body: JSON.stringify(entrega)
            })
                .then(function (resposta) {
                    return resposta.json();
                })
                .then(function (resultado) {

                    if (resultado.sucesso) {

                        sessionStorage.setItem("entregaEnviada", "true");

                        botaoEnviar.textContent = "Memorial enviado!";
                        alert("Memorial enviado com sucesso!");

                        console.log("Entrega confirmada pelo Google!");

                    } else {

                        console.error("Erro informado pelo Google:", resultado.mensagem);

                        botaoEnviar.disabled = false;
                        botaoEnviar.textContent = "Enviar Memorial";

                        alert("Não foi possível registrar a entrega. Tente novamente.");
                    }

                })
                .catch(function (erro) {

                    console.error("Erro na comunicação:", erro);

                    botaoEnviar.disabled = false;
                    botaoEnviar.textContent = "Enviar Memorial";

                    alert(
                        "Não conseguimos confirmar o envio. " +
                        "Verifique a planilha antes de tentar novamente."
                    );

                });

            console.log("ENTREGA COMPLETA:", entrega);

        });
    }
});
