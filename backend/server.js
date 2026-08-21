const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

const PORT = 3000;


/* =========================
   CONFIGURAÇÕES
========================= */

app.use(express.json());

app.use(cors());

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);
app.use("/css", express.static(path.join(__dirname, "../css")));

/* =========================
   BANCO DE DADOS
========================= */

const DB_FILE =
    path.join(__dirname, "db.json");


function readDB() {

    if (!fs.existsSync(DB_FILE)) {

        const bancoInicial = {

            usuarios: [
                {
                    usuario: "medico",
                    senha: "123",
                    tipo: "medico"
                },
                {
                    usuario: "triagem",
                    senha: "123",
                    tipo: "triagem"
                },
                {
                    usuario: "atendimento",
                    senha: "123",
                    tipo: "atendimento"
                }
            ],

            pacientes: [],

            triagens: [],

            consultas: [],

            medicacoes: [
                "Dipirona",
                "Paracetamol",
                "Ibuprofeno",
                "Amoxicilina"
            ],

            chamadas: []

        };


        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(
                bancoInicial,
                null,
                2
            )
        );


        return bancoInicial;
    }


    const dados =
        fs.readFileSync(
            DB_FILE,
            "utf8"
        );


    return JSON.parse(dados);

}


function writeDB(data) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}


/* =========================
   LOGIN
========================= */

app.post("/login", (req, res) => {

    try {

        const {
            usuario,
            senha
        } = req.body;


        const db = readDB();


        const encontrado =
            db.usuarios.find(user =>

                user.usuario === usuario &&
                user.senha === senha

            );


        if (!encontrado) {

            return res.status(401).json({

                erro:
                    "Usuário ou senha inválidos"

            });

        }


        res.json({

            sucesso: true,

            usuario:
                encontrado.usuario,

            tipo:
                encontrado.tipo

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro:
                "Erro no servidor"

        });

    }

});


/* =========================
   ATENDIMENTO
========================= */

app.post("/atendimento", (req, res) => {

    try {

        const db = readDB();


        if (!db.pacientes) {
            db.pacientes = [];
        }


        const paciente = {

            id:
                Date.now(),

            nome:
                req.body.nome,

            cpf:
                req.body.cpf,

            tipo:
                req.body.tipo,

            status:
                "aguardando_triagem",

            data:
                new Date().toISOString()

        };


        db.pacientes.push(paciente);


        writeDB(db);


        res.json({

            sucesso: true,

            paciente

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro:
                "Erro ao cadastrar paciente"

        });

    }

});


/* =========================
   LISTAR PACIENTES
========================= */

app.get("/pacientes", (req, res) => {

    const db = readDB();

    const pacientes =
        db.pacientes || [];


    res.json(pacientes);

});


/* =========================
   TRIAGEM
========================= */

app.post("/triagem", (req, res) => {

    try {

        const db = readDB();


        if (!db.triagens) {
            db.triagens = [];
        }


        const triagem = {

            id:
                Date.now(),

            nome:
                req.body.nome,

            sintoma:
                req.body.sintoma,

            temperatura:
                req.body.temperatura,

            alergia:
                req.body.alergia,

            observacao:
                req.body.observacao,

            risco:
                req.body.risco,

            data:
                new Date().toISOString()

        };


        db.triagens.push(triagem);


        writeDB(db);


        res.json({

            sucesso: true,

            triagem

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro:
                "Erro ao salvar triagem"

        });

    }

});


/* =========================
   LISTAR TRIAGENS
========================= */

app.get("/triagens", (req, res) => {

    const db = readDB();

    res.json(
        db.triagens || []
    );

});


/* =========================
   LISTA DE MEDICAÇÕES
========================= */

app.get(
    "/lista-medicacoes",
    (req, res) => {

        const db = readDB();

        res.json(
            db.medicacoes || []
        );

    }
);


/* =========================
   SALVAR CONSULTA
========================= */

app.post("/consulta", (req, res) => {

    try {

        const db = readDB();


        if (!db.consultas) {
            db.consultas = [];
        }


        const consulta = {

            id:
                Date.now(),

            paciente:
                req.body.paciente,

            diagnostico:
                req.body.diagnostico,

            medicacao:
                req.body.medicacao,

            obs:
                req.body.obs,

            data:
                new Date().toISOString()

        };


        db.consultas.push(
            consulta
        );


        writeDB(db);


        res.json({

            sucesso: true,

            consulta

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro:
                "Erro ao salvar consulta"

        });

    }

});


/* =========================
   MEDICAÇÕES PRESCRITAS
========================= */

app.get("/medicacoes", (req, res) => {

    const db = readDB();

    res.json(
        db.consultas || []
    );

});


/* =========================
   TV
========================= */

app.get("/tv/chamada", (req, res) => {

    const db = readDB();


    const chamadas =
        db.chamadas || [];


    const chamada =
        chamadas.length > 0
            ? chamadas[chamadas.length - 1]
            : null;


    const historico =
        [...chamadas].reverse();


    res.json({

        chamada,

        historico

    });

});


/* =========================
   INICIAR SERVIDOR
========================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor rodando em http://localhost:${PORT}`
        );

    }
);
