import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import NavBar from "../../components/navbar/navBar";
import SpecialtyFilter from "../../components/specialtyFilter/specialtyFilter";
import AppointmentCard from "../../components/appointmentCard/appointmentCard"
import CardDoctors from "../../components/cardDoctors/cardDoctors";
import { Appbar,} from "react-native-paper";
import doctorsData from "../../data/doctorsData";
import { styles } from "./style_doctors"
import { useFetchAppointments } from "../../api/utils/useFetchAppoinments";


const { width: screenWidth } = Dimensions.get("window");

export function Doctors({ navigation, route }) {
  const [selectedButton, setSelectedButton] = React.useState(1);
  const [activePage, setActivePage] = React.useState(0);
  const { appointments, setAppointments } = useFetchAppointments();
  const scrollIndex = React.useRef(null);

  const whenScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(scrollPosition / screenWidth);
    setActivePage(currentPage);
  };

  const changePage = (pageIndex) => {
    scrollIndex.current.scrollTo({ x: pageIndex * screenWidth, animated: false });
    setActivePage(pageIndex);
  };

  const convertDateJson = (dataISO) => {
    const data = new Date(dataISO);

    const day = data.getDate();
    const month = data.getMonth() + 1;
    const year = data.getFullYear();

    const dataFormated = `${day}/${month}/${year}`;
    return dataFormated;
  };

  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate("Main")} />
          <Appbar.Content title="Médicos" />
        </Appbar.Header>

        <View style={styles.headerOptions}>
          <TouchableOpacity onPress={() => changePage(0)}>
            <View style={styles.boxOptions}>
              <Text style={styles.textOptions}>
                Marcar Consulta
              </Text>
              <View
                style={[styles.optionLineStyle, { borderColor: activePage === 0 ? "#0E3C58" : "transparent" }]}
              ></View>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => changePage(1)}>
            <View style={styles.boxOptions}>
              <Text
                style={styles.textOptions}
              >
                Minhas consultas
              </Text>
              <View
                style={[styles.optionLineStyle, { borderColor: activePage === 1 ? "#0E3C58" : "transparent" }]}
              ></View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ display: activePage === 1 ? "none" : "block" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{}}>
            <View
              style={styles.styleScrollFilter}
            >
              <SpecialtyFilter
                title={"Todos"}
                isSelected={selectedButton === 1}
                onPress={() => setSelectedButton(1)}
              />
              <SpecialtyFilter
                title={" Cardiologistas"}
                isSelected={selectedButton === 2}
                onPress={() => setSelectedButton(2)}
              />
              <SpecialtyFilter
                title={"Psicólogos"}
                isSelected={selectedButton === 3}
                onPress={() => setSelectedButton(3)}
              />
              <SpecialtyFilter
                title={"Clínicos Gerais"}
                isSelected={selectedButton === 4}
                onPress={() => setSelectedButton(4)}
              />
              <SpecialtyFilter
                title={"Dermatologistas"}
                isSelected={selectedButton === 5}
                onPress={() => setSelectedButton(5)}
              />
            </View>
          </ScrollView>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={whenScroll}
          ref={scrollIndex}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.optionsScreenSize}>
            <ScrollView>
              {doctorsData.map((doctor, index) => (
                <CardDoctors
                  key={index}
                  source={doctor.source}
                  title={doctor.title}
                  specialty={doctor.specialty}
                  clinic={doctor.clinic}
                  onPress={() => navigation.navigate("Profile Doctors", { doctor })}
                />))}
            </ScrollView>
          </View>
          <View style={styles.optionsScreenSize}>
            {appointments.length > 0 ? (
              <ScrollView>
                {appointments.map((appointment, index) => (
                  <AppointmentCard
                    key={index}
                    dateAppointment={convertDateJson(appointment.dateAppointment)}
                    timeAppointment={appointment.timeAppointment}
                    source={appointment.source}
                    title={appointment.title}
                    specialty={appointment.specialty}
                    clinic={appointment.clinic}
                    appointmentId={appointment._id} 
                    updateAppointments={setAppointments}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center' }}>Não há agendamentos.</Text>
            )}
          </View>
        </ScrollView>

      </View>

      <NavBar navigation={navigation} route={route} />

    </SafeAreaView>
  );
}