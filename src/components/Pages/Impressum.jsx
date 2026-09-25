import React, { Component } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

class Impressum extends Component {
  render() {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Paper elevation={1} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Typography variant="h3" component="h1">
              Impressum
            </Typography>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Angaben gemäß § 5 TMG
              </Typography>
              <Typography variant="body1">Reedu GmbH &amp; Co. KG</Typography>
              <Typography variant="body1">Johann-Krane-Weg 23</Typography>
              <Typography variant="body1">48149 Münster</Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Kontakt
              </Typography>
              <Typography variant="body1">Telefon: +49 251 98119797</Typography>
              <Typography variant="body1">
                E-Mail: <a href="mailto:kontakt@reedu.de">kontakt@reedu.de</a>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Vertreten durch
              </Typography>
              <Typography variant="body1">
                Reedu Verwaltungs GmbH, vertreten durch die Geschäftsführer Dr.
                Thomas Bartoschek und Umut Tas
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Geschäftsführer
              </Typography>
              <Typography variant="body1">
                Dr. Thomas Bartoschek &amp; Umut Tas
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </Typography>
              <Typography variant="body1">Dr. Thomas Bartoschek</Typography>
              <Typography variant="body1">Reedu GmbH &amp; Co. KG</Typography>
              <Typography variant="body1">Johann-Krane-Weg 23</Typography>
              <Typography variant="body1">48149 Münster</Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Registereintrag
              </Typography>
              <Typography variant="body1">
                Registergericht: Amtsgericht Münster
              </Typography>
              <Typography variant="body1">Registernummer: HRA 10639</Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Streitschlichtung
              </Typography>
              <Typography variant="body1" paragraph>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                . Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </Typography>
              <Typography variant="body1">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Haftung für Inhalte
              </Typography>
              <Typography variant="body1" paragraph>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </Typography>
              <Typography variant="body1">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden
                wir diese Inhalte umgehend entfernen.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Haftung für Links
              </Typography>
              <Typography variant="body1" paragraph>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar.
              </Typography>
              <Typography variant="body1">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                derartige Links umgehend entfernen.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                Urheberrecht
              </Typography>
              <Typography variant="body1" paragraph>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                Downloads und Kopien dieser Seite sind nur für den privaten,
                nicht kommerziellen Gebrauch gestattet.
              </Typography>
              <Typography variant="body1">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
                werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden
                von Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  }
}

export default Impressum;
