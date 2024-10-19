/* eslint-disable react/prop-types */
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MatrixTable(props) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  if (props.matrices.length === 0) {
    return (
      <div className="text-center text-gray-700 mt-44">
        {t("matrixCardDashboard.noMatrix")}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto mx-14 shadow-2xl mb-36 mt-9 ${direction}`}>
      <table className="w-full text-center   shadow-lg" dir={direction}>
        <thead className=" text-xl font-semibold uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              {t("legislationsinfo.name")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("legislationsinfo.publisher")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("subjectInfo.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.matrices.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
              } border-b text-xl font-semibold  transition-all`}
            >
              {/* Role */}
              <td className="px-6 py-4  font-semibold text-xl dark:text-white whitespace-nowrap">
                {item.title}
              </td>

              <td className="px-6 py-4 text-xl font-semibold">
                {item.companyName}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 ">
                <button
                  className={`font-semibold hover:underline `}
                  onClick={() => {
                    navigate("/MatrixInfo", { state: { item } });
                  }}
                >
                  {t("matrix.details")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
