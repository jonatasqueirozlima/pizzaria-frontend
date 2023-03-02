import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

import useAddressesState from "@/store/checkout/useAddresses";
import type { IAddress } from "@/types/address.type";

import * as api from "../../services/api";
import SearchPlaceInput from "../inputs/SearchPlaceInput";
import AddressFieldTooltip from "../tooltips/AddressFieldTooltip";

type Props = {
  addressId?: string;
  defaultValues?: {
    referencePoint?: string;
    complement?: string;
    address?: string;
  };
};

export default function AddAddressModal({ addressId, defaultValues }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addAddress } = useAddressesState();
  const addressRef = useRef<IAddress>();
  const complementRef = useRef<HTMLInputElement>(null);
  const referencePointRef = useRef<HTMLTextAreaElement>(null);

  const modalHeaderTitle = (addressId ? "Atualizar " : "Cadastrar ").concat(
    "endereço"
  );

  const onSelectAddress = (address: IAddress) => {
    addressRef.current = address;
  };

  const onConfirmAddress = () => {
    const data = {
      city: addressRef.current?.city || "",
      country: addressRef.current?.country || "",
      postcode: addressRef.current?.postcode || "",
      lat: addressRef.current?.lat || 0,
      lon: addressRef.current?.lon || 0,
      place_id: addressRef.current?.place_id || "",
      state_code: addressRef.current?.state_code || "",
      street: addressRef.current?.street || "",
      housenumber: addressRef.current?.housenumber || "",
      suburb: addressRef.current?.suburb || "",
      ...(referencePointRef.current?.value !== "" && {
        referencePoint: referencePointRef.current?.value || "",
      }),
      ...(complementRef.current?.value !== "" && {
        complement: complementRef.current?.value || "",
      }),
    };

    api.addAddress({ ...data }).then((addressId_) => {
      addAddress({
        _id: addressId_ || "",
        ...data,
      });
      // setAddress(addressId_ || "");

      onClose();
    });
  };

  return (
    <>
      <Button
        className="underline underline-offset-4 m-0 p-0 bg-white"
        onClick={onOpen}
      >
        Adicionar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="w-fit">
          <ModalHeader className="">{modalHeaderTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack className="items-start space-y-4">
              <FormControl>
                <FormLabel htmlFor="address">Endereço</FormLabel>
                <Input
                  defaultValue={addressId && defaultValues?.address}
                  id="address"
                  as={SearchPlaceInput}
                  onSelectAddress={onSelectAddress}
                />
              </FormControl>
              <FormControl>
                <HStack>
                  <FormLabel htmlFor="complement" className="m-0">
                    Complemento (opcional)
                  </FormLabel>
                  <AddressFieldTooltip
                    label="em alguns tipos de residências existem outro número para identificá-lo, por exemplo apartamento e é necessário informar tal número"
                    fieldName="complement"
                  />
                </HStack>
                <Input
                  id="complement"
                  ref={complementRef}
                  className="border border-gray-500"
                  defaultValue={addressId && defaultValues?.complement}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="observation">
                  Observações (opcional)
                </FormLabel>
                <Textarea
                  id="observation"
                  ref={referencePointRef}
                  defaultValue={addressId && defaultValues?.referencePoint}
                  className="max-h-20 border border-gray-500 placeholder:text-gray-600"
                  placeholder="Ex: perto de tal bar, próximo de tal mercado, etc"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onConfirmAddress}
              className="bg-gray-default text-white"
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
